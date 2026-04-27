import { Role, UserStatus } from "../../../generated/prisma/client.js";
import AppError from "../../errorHealps/appError.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import status from "http-status";
import { RegisterPatientSchema, LoginSchema, type RegisterPatientPayload, type LoginPayload } from "./auth.validation.js";
import { tokenUtils } from "../../utils/tokens.js";

const registerPatient = async (payload: RegisterPatientPayload) => {
    // Validate input using Zod
    const validatedData = RegisterPatientSchema.parse(payload);
    const { 
        name, 
        email, 
        password,
        profilePicture,
        dateOfBirth,
        gender,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        country,
        emergencyContact,
        emergencyPhone,
        bloodGroup,
        allergies,
        medicalHistory
    } = validatedData;

    // Register user with BetterAuth
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    });

    if (!data.user) {
        throw new AppError("Failed to register patient", status.INTERNAL_SERVER_ERROR);
    }

    const userId = data.user.id;

    try {
        // Use transaction to update user role and create patient profile
        const patientData = await prisma.$transaction(async (tx) => {
            // Update user role to PATIENT
            await tx.user.update({
                where: { id: userId },
                data: {
                    role: Role.PATIENT,
                }
            });

            // Create patient profile with all fields
            const patient = await tx.patient.create({
                data: {
                    userId: userId,
                    name: name,
                    email: email,
                    profilePicture: profilePicture,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    gender: gender,
                    phoneNumber: phoneNumber,
                    address: address,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                    country: country,
                    emergencyContact: emergencyContact,
                    emergencyPhone: emergencyPhone,
                    bloodGroup: bloodGroup,
                    allergies: allergies,
                    medicalHistory: medicalHistory,
                }
            });

            return patient;
        });

        // Auto-login after registration to get token
        const loginData = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        });

        // Combine login data with patient information
        return {
            ...loginData,
            patient: patientData
        };
    } catch (error) {
        console.error("Error in registerPatient:", error);
        
        // If patient creation fails, clean up the BetterAuth user
        try {
            await prisma.user.delete({
                where: { id: userId }
            });
            console.log(`Cleaned up user ${userId} after failed registration`);
        } catch (cleanupError) {
            console.error("Failed to cleanup user after error:", cleanupError);
        }
        
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            error instanceof Error
                ? error.message
                : "An error occurred while registering the patient",
            status.INTERNAL_SERVER_ERROR
        );
    }
};

const login = async (payload: LoginPayload) => {
    // Validate input using Zod
    const validatedData = LoginSchema.parse(payload);
    const { email, password } = validatedData;

    // 🔍 Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
        include: {
            patient: true // Include patient data
        }
    });

    if (!existingUser) {
        throw {
            status: "UNAUTHORIZED",
            message: "Invalid email or password"
        };
    }

    // 🚫 Check account status
    if (existingUser.status === UserStatus.DELETED) {
        throw {
            status: "FORBIDDEN",
            message: "This account has been deleted"
        };
    }

    if (existingUser.status === UserStatus.BLOCKED) {
        throw {
            status: "FORBIDDEN",
            message: "This account has been blocked. Please contact support"
        };
    }

    // 🔐 Proceed with authentication
    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });

    if (!data) {
        throw {
            status: "UNAUTHORIZED",
            message: "Invalid email or password"
        };
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: existingUser.id,
        role: existingUser.role,
        name: existingUser.name,
        email: existingUser.email,
        status: existingUser.status,
        isDeleted: existingUser.isDeleted,
        emailVerified: existingUser.emailVerified,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: existingUser.id,
        role: existingUser.role,
        name: existingUser.name,
        email: existingUser.email,
        status: existingUser.status,
        isDeleted: existingUser.isDeleted,
        emailVerified: existingUser.emailVerified,
    });
    return {
        ...data,
        accessToken,
        refreshToken,
        patient: existingUser.patient
    };
};

export const AuthService = {
    registerPatient,
    login,
};
