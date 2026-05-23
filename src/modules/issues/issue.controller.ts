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
        const { sort, type, status } = req.query;
        const allowedTypes = ["bug", "feature_request"];
        const allowedStatuses = ["open", "in_progress", "resolved"];

        if (type && !allowedTypes.includes(type as string)) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "Invalid issue type"
            })
        }
        if (status && !allowedStatuses.includes(status as string)) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "Invalid issue status"
            })
        }

        let query = `SELECT * FROM issues WHERE 1 = 1`;

        const values: string[] = [];
        if (type) {
            values.push(type as string);
            query += ` AND type = $${values.length}`;
        }
        if (status) {
            values.push(status as string);
            query += ` AND status = $${values.length}`;
        }

        if (sort === "oldest") {
            query += ` ORDER BY created_at ASC`;
        } else {
            query += ` ORDER BY created_at DESC`;
        }

        const issueResult = await pool.query(query, values);

        const issues = issueResult.rows;

        const issuesWithReporterDetails = await Promise.all(
            issues.map(async (issue) => {
                const userResult = await pool.query(
                    `SELECT id, name, role FROM users WHERE id=$1`, [issue.reporter_id]
                );
                const { reporter_id, ...issueData } = issue;
                return {
                    ...issueData,
                    reporter: userResult.rows[0]
                }
            })
        );

        return sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Issues retrieved successfully",
            data: issuesWithReporterDetails
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
        const issueResult = await pool.query(
            `SELECT * FROM issues WHERE id=$1`, [id]
        );

        if (issueResult.rows.length === 0) {
            return sendResponse(res, {
                success: false,
                statusCode: 404,
                message: "Issue not found"
            })
        }

        const issue = issueResult.rows[0];
        const userResult = await pool.query(
            `SELECT id, name, role FROM users WHERE id=$1`, [issue.reporter_id]
        );

        const { reporter_id, ...issueData } = issue;
        const issueWithReporterDetails = {
            ...issueData,
            reporter: userResult.rows[0]
        }

        return sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Issue retrieved successfully",
            data: issueWithReporterDetails
        })
    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve issue",
            errors: error
        })
    }
};

export const updateIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, type, status } = req.body;
        if (!req.user) {
            return sendResponse(res, {
                success: false,
                statusCode: 401,
                message: "Unauthorized access"
            })
        };

        const issueResult = await pool.query(
            `SELECT * FROM issues WHERE id=$1`, [id]
        );

        if (issueResult.rows.length === 0) {
            return sendResponse(res, {
                success: false,
                statusCode: 404,
                message: "Issue not found"
            })
        }

        const issue = issueResult.rows[0];
        const isMaintainer = req.user.role === "maintainer";
        const isOwner = req.user.id === issue.reporter_id;

        if (!isMaintainer && !isOwner) {
            return sendResponse(res, {
                success: false,
                statusCode: 403,
                message: "You are not allowed to update this issue"
            })
        };
        if (!isMaintainer && issue.status !== "open") {
            return sendResponse(res, {
                success: false,
                statusCode: 409,
                message: "Only open issues can be updated by contributor"
            })
        };

        const allowedTypes = ["bug", "feature_request"];

        const allowedStatuses = ["open", "in_progress", "resolved"];

        if (type && !allowedTypes.includes(type as string)) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "Invalid issue type"
            })
        };
        if (status && !allowedStatuses.includes(status as string)) {
            return sendResponse(res, {
                success: false,
                statusCode: 400,
                message: "Invalid issue status"
            })
        }

        if (status && !isMaintainer) {
            return sendResponse(res, {
                success: false,
                statusCode: 403,
                message: "Only maintainer can update issue status"
            })
        };

        const updatedIssue = await pool.query(
            `UPDATE issues 
            SET title=COALESCE($1, title), 
            description=COALESCE($2, description), 
            type=COALESCE($3, type),
            status=COALESCE($4, status), 
            updated_at=NOW() 
            WHERE id=$5 
            RETURNING *`, [title, description, type, status, id]
        );
        return sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Issue updated successfully",
            data: updatedIssue.rows[0]
        })

    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Issue update failed",
            errors: error
        })
    }
};

export const deleteIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return sendResponse(res, {
                success: false,
                statusCode: 401,
                message: "Unauthorized access"
            })
        }
        if (req.user.role !== "maintainer") {
            return sendResponse(res, {
                success: false,
                statusCode: 403,
                message: "Only maintainer can delete issue"
            })
        }

        const issueResult = await pool.query(
            `SELECT * FROM issues WHERE id=$1`, [id]
        );
        if (issueResult.rows.length === 0) {
            return sendResponse(res, {
                success: false,
                statusCode: 404,
                message: "Issue not found"
            })
        }
        await pool.query(
            `DELETE FROM issues WHERE id=$1`, [id]
        );
        return sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Issue deleted successfully"
        })
    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Issue delete failed",
            errors: error
        })
    }
}