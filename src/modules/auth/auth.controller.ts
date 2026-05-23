import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import bcrypt from 'bcrypt';
import { pool } from "../../config/db";


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "Name, Email & Password required"
            })
        }

        const userRole = role || 'contributor';

        if (!["contributor", "maintainer"].includes(userRole)) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "Invalid user role"
            })
        }

        const existingUser = await pool.query(
            `
            SELECT * FROM users WHERE email=$1
            `, [email]
        );
        if (existingUser.rows.length > 0) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at
            `, [name, email, hashedPassword, userRole]
        );

        return sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "User registered successfully",
            data: result.rows[0]
        })


    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Registration failed",
            errors: error
        })
    }
};