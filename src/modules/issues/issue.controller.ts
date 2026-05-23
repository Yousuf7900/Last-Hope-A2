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
};

export const getAllIssues = async (req: AuthRequest, res: Response) => {
    try {

        const result = await pool.query(
            `SELECT * FROM issues ORDER BY created_at DESC`
        );

        return sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Issues retrieved successfully",
            data: result.rows
        })
    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve issues",
            errors: error
        })
    }
};

export const getSingleIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT * FROM issues WHERE id=$1`, [id]
        );

        if (result.rows.length === 0) {
            return sendResponse(res, {
                success: false,
                statusCode: 404,
                message: "Issue not found"
            })
        }
        return sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Issue retrieved successfully",
            data: result.rows[0]
        })
    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve issue",
            errors: error
        })
    }
}