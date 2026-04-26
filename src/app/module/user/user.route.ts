import { Router } from "express";
import { DoctorController } from "./user.controller";

import { validateCreateDoctor } from "../../middleware/validateRequest";



const router = Router();

// Doctor routes
router.post("/create-doctor", validateCreateDoctor, DoctorController.createDoctor);

export const UserRoute = router;