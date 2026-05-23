
import express from "express";

import verifyToken from "../../middleware/auth.middleware";
import { createIssue } from "./issue.controller";

const router = express.Router();

router.post("/", verifyToken, createIssue);
export const issueRoutes = router;