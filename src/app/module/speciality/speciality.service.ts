import { Speciality } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { CreateSpecialitySchema, UpdateSpecialitySchema, type CreateSpecialityPayload, type UpdateSpecialityPayload } from "./speciality.validation.js";

const createSpeciality = async (payload: CreateSpecialityPayload): Promise<Speciality> => {
    // Validate input using Zod
    const validatedData = CreateSpecialitySchema.parse(payload);
    
    const speciality = await prisma.speciality.create({
        data: validatedData
    })
    return speciality;
}

const getAllSpecialities = async (): Promise<Speciality[]> => {
    const specialities = await prisma.speciality.findMany();
    return specialities;
}

const deleteSpeciality = async (id: string): Promise<Speciality> => {
    const speciality = await prisma.speciality.delete({
        where: { id }
    });
    return speciality;
};

const updateSpeciality = async (id: string, payload: UpdateSpecialityPayload): Promise<Speciality> => {
    // Validate input using Zod
    const validatedData = UpdateSpecialitySchema.parse(payload);
    
    const speciality = await prisma.speciality.update({
        where: { id },
        data: validatedData
    });
    return speciality;
};

const getSpecialityById = async (id: string): Promise<Speciality | null> => {
    const speciality = await prisma.speciality.findUnique({
        where: { id }
    });
    return speciality;
};



export const SpecialityService = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality,
    getSpecialityById
}
