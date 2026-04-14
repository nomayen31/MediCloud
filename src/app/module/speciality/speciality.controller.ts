import { NextFunction, Request, Response } from "express";
import { SpecialityService } from "./speciality.service";

const createSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const result = await SpecialityService.createSpeciality(payload);
        res.status(201).json({
            success: true,
            data: result,
            message: "Speciality created successfully"
        });
    } catch (error: unknown) {
        console.log("Error in createSpeciality controller:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the speciality"
        });
        next(error); // ← forward to error middleware
    }
};

const getAllSpecialities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await SpecialityService.getAllSpecialities();
        res.status(200).json({
            message: "Specialities fetched successfully",
            success: true,
            data: result
        });
    } catch (error: unknown) {
        console.log("Error in getAllSpecialities controller:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching specialities"
        });
        next(error);
    }   
};  

const deleteSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const result = await SpecialityService.deleteSpeciality(id as string);
        res.status(200).json({
            success: true,
            message: "Speciality deleted successfully",
            data: result
        });
    } catch (error: unknown) {
        console.log("Error in deleteSpeciality controller:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the speciality"
        });
        next(error);
    }
};

const updateSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        // Implementation for updating a speciality will go here
        const result = await SpecialityService.updateSpeciality(id as string, payload);
        res.status(200).json({
            success: true,
            message: "Speciality updated successfully",
            data: result
        });
    } catch (error: unknown) {
        console.log("Error in updateSpeciality controller:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the speciality"
        });
        next(error);
    }
};

const getSpecialityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        
        // Add this to check what ID you're receiving
        console.log("Received ID:", id);
        console.log("ID type:", typeof id);
        
        const result = await SpecialityService.getSpecialityById(id as string);
        
        // Add this to see what the query returned
        console.log("Query result:", result);
        
        res.status(200).json({
            success: true,
            message: "Speciality fetched successfully",
            data: result
        });
    } catch (error: unknown) {
        console.log("Error in getSpecialityById controller:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the speciality"
        });
        next(error);
    }
};


export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality,
    getSpecialityById
}   