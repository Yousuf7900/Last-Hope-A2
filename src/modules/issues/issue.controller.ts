import { pool } from "../../config/db";
import sendResponse from "../../utils/sendResponse";
import type { AuthRequest } from "../../middleware/auth.middleware";
import type { Request, Response } from "express";

export const createIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, type } = req.body;
        if (!title || !description || !type) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "All fields are required"
            })
        }

        if (!req.user) {
            return sendResponse(res, {
                success: false,
                statusCode: 401,
                message: "Unauthorized access"
            })
        }

        const reporter_id = req.user.id;
        const result = await pool.query(
            `
            INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *
            `, [title, description, type, reporter_id]
        );
        return sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Issue created successfully",
            data: result.rows[0]
        });

    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Issue creation failed",
            errors: error
        })
    }
}