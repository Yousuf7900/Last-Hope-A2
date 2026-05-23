import express from "express";

import { loginUser, registerUser } from "./auth.controller";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);


export const authRoutes = router;
