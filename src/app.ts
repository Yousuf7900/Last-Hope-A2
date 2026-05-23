import express, { type Application, type Request, type Response } from "express";
import cors from 'cors';


const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "API is Online"
    });
});


export default app;