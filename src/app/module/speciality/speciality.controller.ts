import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";




const createSpeciality = validateRequest(async (req: Request, res: Response) => {
    const result = await SpecialityService.createSpeciality(req.body);

    sendResponse(res, {
        success: true,
        data: result,
        message: "Speciality created successfully",
        httpStatusCode: 201
    });
});

const getAllSpecialities = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialityService.getAllSpecialities();
    sendResponse(res, {
        success: true,
        message: "Specialities fetched successfully",
        data: result,
        httpStatusCode: 200
    });
});

const getSpecialityById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    // Validate that id is a string, not an array
    if (Array.isArray(id)) {
        return sendResponse(res, {
            success: false,
            message: "Invalid ID format",
            httpStatusCode: 400
        });
    }
    
    console.log("Received ID:", id);
    console.log("ID type:", typeof id);
    
    const result = await SpecialityService.getSpecialityById(id);
    
    console.log("Query result:", result);
    
    if (!result) {
        return sendResponse(res, {
            success: false,
            message: "Speciality not found",
            httpStatusCode: 404
        });
    }
    
    sendResponse(res, {
        success: true,
        message: "Speciality fetched successfully",
        data: result,
        httpStatusCode: 200
    });
});

const updateSpeciality = validateRequest(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    // Validate that id is a string, not an array
    if (Array.isArray(id)) {
        return sendResponse(res, {
            success: false,
            message: "Invalid ID format",
            httpStatusCode: 400
        });
    }

    const result = await SpecialityService.updateSpeciality(id, payload);

    sendResponse(res, {
        success: true,
        message: "Speciality updated successfully",
        data: result,
        httpStatusCode: 200
    });
});

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    // Validate that id is a string, not an array
    if (Array.isArray(id)) {
        return sendResponse(res, {
            success: false,
            message: "Invalid ID format",
            httpStatusCode: 400
        });
    }
    
    const result = await SpecialityService.deleteSpeciality(id);
    
    if (!result) {
        return sendResponse(res, {
            success: false,
            message: "Speciality not found",
            httpStatusCode: 404
        });
    }
    
    sendResponse(res, {
        success: true,
        message: "Speciality deleted successfully",
        data: result,
        httpStatusCode: 200
    });
});

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    getSpecialityById,
    updateSpeciality,
    deleteSpeciality
};
