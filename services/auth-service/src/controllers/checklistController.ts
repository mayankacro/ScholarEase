import { Request, Response } from "express";
import ChecklistRule from "../models/ChecklistRule";

export const createChecklistRule = async (
    req: Request,
    res: Response
) => {
    try {

        const {
            scholarshipType,
            requiredDocuments,
        } = req.body;

        if (!scholarshipType || !requiredDocuments) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const rule = await ChecklistRule.create({
            scholarshipType,
            requiredDocuments,
        });

        return res.status(201).json({
            success: true,
            rule,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};



export const getChecklistRule = async (req: Request, res: Response) => {
    try {

        const scholarshipType = req.params.scholarshipType as string;

        const rule = await ChecklistRule.findOne({
            scholarshipType,
        });

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: "Checklist not found",
            });
        }

        return res.status(200).json({
            success: true,
            rule,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};