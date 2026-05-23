import express, { type Application, type Request, type Response } from "express";
import cors from 'cors';

import { authRoutes } from "./modules/auth/auth.routes";


const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "API is Online"
    });
});

app.use("/api/auth", authRoutes);


export default app;