import { Router } from "express";
import { DoctorController } from "./user.controller";

const router = Router();

// Doctor routes
router.post("/create-doctor", DoctorController.createDoctor);
// router.post("/create-admin", DoctorController.createAdmin);
// router.post("/create-superadmin", DoctorController.createSuperAdmin);

export const UserRoute = router;