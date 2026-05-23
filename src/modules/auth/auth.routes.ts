import express from "express";

import { registerUser } from "./auth.controller";

const router = express.Router();

router.post("/signup", registerUser);


export const authRoutes = router;
