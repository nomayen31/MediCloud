import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route";
import { AuthRoute } from "../module/auth/auth.route";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/specialities", SpecialityRoutes);


export const IndexRoutes = {
    router
}