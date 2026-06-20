import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization; //Header pe token gya: bearer ******

        if (!authHeader || !authHeader.startsWith("Bearer ")) { //toke bheja? nahi to unauthorized
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1] as string; //yaha token split hota h bearer se . 1 mtlb sirf token nikal lo

        const decoded = jwt.verify(  //server bolta hai token asli hai ya fake?
            token,
            process.env.JWT_SECRET as string 
        );


        (req as any).user = decoded; //Yahan middleware request me data chipka deta hai.

        next(); //profile function pe jata hai 

    } catch (error) { //agr fake token to Invalid Token

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};