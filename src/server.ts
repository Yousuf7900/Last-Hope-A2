import dotenv from "dotenv";

dotenv.config();

import app from "./app";

import { connectDB } from "./config/db";
import { initDB } from "./config/initDB";

const port = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
    await connectDB();
    await initDB();

    app.listen(port, () => {
        console.log(`Server running on ${port}`);
    })
}

startServer();