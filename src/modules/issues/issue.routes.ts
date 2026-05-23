
import express from "express";

import verifyToken from "../../middleware/auth.middleware";
import { createIssue, getAllIssues, getSingleIssue, updateIssue, deleteIssue } from "./issue.controller";

const router = express.Router();

router.post("/", verifyToken, createIssue);
router.get("/", getAllIssues);
router.get("/:id", getSingleIssue);
router.patch("/:id", verifyToken, updateIssue);
router.delete("/:id", verifyToken, deleteIssue)

export const issueRoutes = router;