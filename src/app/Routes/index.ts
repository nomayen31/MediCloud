import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route.js";
import { AuthRoute } from "../module/auth/auth.route.js";
import { UserRoute } from "../module/user/user.route.js";
import { DoctorRoutes } from "../module/Doctor/doctor.route.js";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/specialities", SpecialityRoutes);
router.use("/users",UserRoute);
router.use("/doctors", DoctorRoutes);


export const IndexRoutes = {
    router
}
