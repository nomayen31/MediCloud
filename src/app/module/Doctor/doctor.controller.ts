import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getAllDoctors();
    sendResponse(res, {
        success: true,
        message: "Doctors fetched successfully",
        data: result,
        httpStatusCode: status.OK
    });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (Array.isArray(id)) {
        return sendResponse(res, {
            success: false,
            message: "Invalid ID format",
            httpStatusCode: status.BAD_REQUEST
        });
    }
    
    const result = await DoctorService.getDoctorById(id);
    
    if (!result) {
        return sendResponse(res, {
            success: false,
            message: "Doctor not found",
            httpStatusCode: status.NOT_FOUND
        });
    }
    
    sendResponse(res, {
        success: true,
        message: "Doctor fetched successfully",
        data: result,
        httpStatusCode: status.OK
    });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    
    if (Array.isArray(id)) {
        return sendResponse(res, {
            success: false,
            message: "Invalid ID format",
            httpStatusCode: status.BAD_REQUEST
        });
    }
    
    const result = await DoctorService.updateDoctor(id, payload);
    
    if (!result) {
        return sendResponse(res, {
            success: false,
            message: "Doctor not found",
            httpStatusCode: status.NOT_FOUND
        });
    }
    
    sendResponse(res, {
        success: true,
        message: "Doctor updated successfully",
        data: result,
        httpStatusCode: status.OK
    });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (Array.isArray(id)) {
        return sendResponse(res, {
            success: false,
            message: "Invalid ID format",
            httpStatusCode: status.BAD_REQUEST
        });
    }
    
    const result = await DoctorService.deleteDoctor(id);
    
    if (!result) {
        return sendResponse(res, {
            success: false,
            message: "Doctor not found",
            httpStatusCode: status.NOT_FOUND
        });
    }
    
    sendResponse(res, {
        success: true,
        message: "Doctor deleted successfully",
        data: result,
        httpStatusCode: status.OK
    });
});

export const DoctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}
