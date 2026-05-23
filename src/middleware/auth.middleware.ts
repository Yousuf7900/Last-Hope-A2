
import jwt from "jsonwebtoken";
import sendResponse from "../utils/sendResponse";
import type { NextFunction, Request, Response } from "express";

interface JsonPayload {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
}

export interface AuthRequest extends Request {
    user?: JsonPayload;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return sendResponse(res, {
            success: false,
            statusCode: 401,
            message: "Unauthorized access"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JsonPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 401,
            message: "Invalid or expired token",
            errors: error
        })
    }
}

export default verifyToken;