import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorRequestZodSchema } from "./doctor.validation";

const router = Router();

router.get("/", DoctorController.getAllDoctors);

router.get("/:id", DoctorController.getDoctorById);

router.put("/:id", validateRequest(updateDoctorRequestZodSchema), DoctorController.updateDoctor);

router.delete("/:id", DoctorController.deleteDoctor);

export const DoctorRoutes = router;
