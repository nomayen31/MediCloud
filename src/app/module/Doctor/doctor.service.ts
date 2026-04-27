import { Prisma, Doctor } from "../../../generated/prisma/client.js";
import AppError from "../../errorHealps/appError.js";
import { prisma } from "../../lib/prisma.js";
import status from "http-status";
import { updateDoctorZodSchema } from "./doctor.validation.js";

const getAllDoctors = async (): Promise<Doctor[]> => {
    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false }
    });
    return doctors;
}

const getDoctorById = async (id: string): Promise<Doctor | null> => {
    const doctor = await prisma.doctor.findUnique({
        where: { id, isDeleted: false }
    });
    return doctor;
};

const updateDoctor = async (id: string, payload: Prisma.DoctorUpdateInput): Promise<Doctor> => {
    // Validate input using Zod
    const validatedData = updateDoctorZodSchema.parse(payload);

    return await prisma.$transaction(async (tx) => {
        // Check if doctor exists and is not deleted
        const existingDoctor = await tx.doctor.findUnique({
            where: { id }
        });

        if (!existingDoctor || existingDoctor.isDeleted) {
            throw new AppError("Doctor not found or has been deleted", status.NOT_FOUND);
        }

        // Update the doctor with validated data
        const updatedDoctor = await tx.doctor.update({
            where: { id },
            data: validatedData
        });

        return updatedDoctor;
    });
};

const deleteDoctor = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (tx) => {
        // Check if doctor exists and is not already deleted
        const existingDoctor = await tx.doctor.findUnique({
            where: { id }
        });

        if (!existingDoctor || existingDoctor.isDeleted) {
            throw new AppError("Doctor not found or already deleted", status.NOT_FOUND);
        }

        // Soft delete: mark as deleted and set deletedAt timestamp
        const deletedDoctor = await tx.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        return deletedDoctor;
    });
};

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}
