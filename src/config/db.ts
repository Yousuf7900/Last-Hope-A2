import { Pool } from "pg";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("Database url is missing on env");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const connectDB = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        console.log("PostgreSQL connected successfully");
        // client.release();
    } catch (error) {
        console.error("PostgreSQL connection failed", error);
        process.exit(1);
    }
}