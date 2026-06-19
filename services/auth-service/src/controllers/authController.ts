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






//         res.status(201).json({
//             success: true,
//             message: "Register API Working ",
//         });
//     } catch (error){
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//         });
//     }
};