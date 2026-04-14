import { Prisma, Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: Prisma.SpecialityCreateInput): Promise<Speciality> => {
    
    const speciality = await prisma.speciality.create({
        data:payload
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

const updateSpeciality = async (id: string, payload: Prisma.SpecialityUpdateInput): Promise<Speciality> => {
    const speciality = await prisma.speciality.update({
        where: { id },
        data: payload
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