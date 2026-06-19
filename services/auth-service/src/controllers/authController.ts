import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;


        //Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check Existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exusts!",
            });
        }

        //Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        //Create user
        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered Successfully",
            user,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        // HTTP requests stateless hoti hain. Login ke baad server user ko JWT token deta hai. User har protected request ke saath token bhejta hai aur server token verify karke identify karta hai ki request kis user ne bheji hai.
        const token = jwt.sign(
            {
                userId: user._id,  //payload:- mtlb token ke andar ye info store hogi
                role: user.role,
            },

            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


export const profile = async (req: Request, res: Response) => {

    return res.status(200).json({
        success: true,
        message: "Protected Route Accessed",
        user: (req as any).user,
    });
};