import { Router } from "express";
import { DoctorController } from "./user.controller.js";

import { validateCreateDoctor } from "../../middleware/validateRequest.js";



const router = Router();

// Doctor routes
router.post("/create-doctor", validateCreateDoctor, DoctorController.createDoctor);

export const UserRoute = router;
