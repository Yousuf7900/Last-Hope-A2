import { type Response } from "express"

interface TypeOfResponse<T> {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;
    errors?: unknown;
}

const sendResponse = <T>(res: Response, data: TypeOfResponse<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        errors: data.errors
    });
}


export default sendResponse;