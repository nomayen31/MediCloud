import { prisma } from "../../lib/prisma.js";
import { auth } from "../../lib/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import AppError from "../../errorHealps/appError.js";
import status from "http-status";
import { ICreateDoctorPayload } from "./user.interface.js";
import { CreateDoctorUserSchema } from "../auth/auth.validation.js";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  // Validate input using Zod
  const validatedData = CreateDoctorUserSchema.parse(payload);
  const { password, doctor: doctorData, specialities: specialityPayload } = validatedData;

  // Check if email already exists in User or Doctor table
  const existingUser = await prisma.user.findUnique({
    where: { email: doctorData.email },
  });

  if (existingUser) {
    throw new AppError("A user with this email already exists", status.CONFLICT);
  }

  const existingDoctor = await prisma.doctor.findUnique({
    where: { email: doctorData.email },
  });

  if (existingDoctor) {
    throw new AppError("A doctor with this email already exists", status.CONFLICT);
  }

  // Extract speciality IDs
  const specialityIds = specialityPayload?.map((s) => s.specialityId) ?? [];

  // Validate specialities exist
  if (specialityIds.length > 0) {
    const existingSpecialities = await prisma.speciality.findMany({
      where: {
        id: { in: specialityIds },
        isDeleted: false,
      },
    });

    if (existingSpecialities.length !== specialityIds.length) {
      const foundIds = existingSpecialities.map((s) => s.id);
      const missingIds = specialityIds.filter((id) => !foundIds.includes(id));
      throw new AppError(
        `Specialities not found: ${missingIds.join(", ")}`,
        status.NOT_FOUND
      );
    }
  }

  // Register user with BetterAuth
  const authData = await auth.api.signUpEmail({
    body: {
      name: doctorData.name,
      email: doctorData.email,
      password: password,
    },
  });

  if (!authData.user) {
    throw new AppError(
      "Failed to register doctor user",
      status.INTERNAL_SERVER_ERROR
    );
  }

  const userId = authData.user.id;

  try {
    // Create doctor with specialities in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user role to DOCTOR
      await tx.user.update({
        where: { id: userId },
        data: {
          role: Role.DOCTOR,
          needsPasswordChange: true,
        },
      });

      // Create the doctor profile
      const newDoctor = await tx.doctor.create({
        data: {
          userId: userId,
          name: doctorData.name,
          email: doctorData.email,
          profilePicture: doctorData.profilePicture,
          specialization: doctorData.specialization,
          qualifications: doctorData.qualifications,
          experience: doctorData.experience,
          licenseNumber: doctorData.licenseNumber,
          registrationNumber: doctorData.registrationNumber,
          phoneNumber: doctorData.phoneNumber,
          address: doctorData.address,
          city: doctorData.city,
          state: doctorData.state,
          zipCode: doctorData.zipCode,
          country: doctorData.country,
          bio: doctorData.bio,
          consultationFee: doctorData.consultationFee,
          availableForOnline: doctorData.availableForOnline,
          currentWorkplace: doctorData.currentWorkplace,
          designation: doctorData.designation,
          gender: doctorData.gender,
        },
      });

      // Create doctor-speciality relationships
      if (specialityIds.length > 0) {
        await tx.doctorSpeciality.createMany({
          data: specialityIds.map((specialityId) => ({
            doctorId: newDoctor.id,
            specialityId,
          })),
        });
      }

      // Fetch complete doctor with relations (without user to avoid duplication)
      const doctorWithRelations = await tx.doctor.findUnique({
        where: { id: newDoctor.id },
        include: {
          specialities: {
            include: {
              speciality: true,
            },
          },
        },
      });

      return doctorWithRelations!;
    });

    // Auto-login after registration to get token
    const loginData = await auth.api.signInEmail({
      body: {
        email: doctorData.email,
        password: password,
      },
    });

    // Return combined data - user comes from loginData, doctor is separate
    return {
      token: loginData.token,
      user: loginData.user,
      doctor: result,
    };
  } catch (error) {
    console.error("Error in createDoctor:", error);

    // Cleanup: Delete user if doctor creation failed
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      console.log(`Cleaned up user ${userId} after failed doctor creation`);
    } catch (cleanupError) {
      console.error("Failed to cleanup user after error:", cleanupError);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error instanceof Error
        ? error.message
        : "An error occurred while creating the doctor",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

export const UserService = {
  createDoctor,
};
