import { Request, Response, NextFunction } from "express";
import { request } from "node:http";

export const roleMidddleware = (allowedRoles: string[]) => { //allowedrole = admin hai routes se aya 
    return (
        req: Request,
        res: Response,
        next: NextFunction
     ) => {
        
        const userRole = (req as any).user.role; //yaha user jo h uska role jwt batata hai: student

        if (!allowedRoles.includes(userRole)) { //checks mtlb ["admin"].includes("student")  ---> false
            return res.status(403).json({
                success: false,
                message: "Access Denied",
            });
        }
        
        next();

    };

};