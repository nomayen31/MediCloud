import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoute } from "../module/user/user.route";
import { DoctorRoutes } from "../module/Doctor/doctor.route";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/specialities", SpecialityRoutes);
router.use("/users",UserRoute);
router.use("/doctors", DoctorRoutes);


export const IndexRoutes = {
    router
}