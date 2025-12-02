"// lib/stakeholders.ts";

import { Projects } from "@prisma/client";
import prisma from "./prisma";

import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";

export async function generateStakeholderCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    // Check if code already exists
    const existingCode = await prisma.code.findFirst({
        where: { code }
    });

    // If code exists, generate a new one recursively
    if (existingCode) {
        return generateStakeholderCode();
    }

    // Insert the code into the database
    await prisma.code.create({
        data: {
            code,
            used: false
        }
    });

    return code;
}

export async function getStakeholdersById(id: string) {
    try {
        const manager = await prisma.managers.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                affiliation: true,
                email: true,
                projects: true,
            },
        });

        if (!manager) {
            return -1;
            // throw new Error("Stakeholder does not exist!")
        }

        return manager;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export async function verifyStakeholderCode({
    code,
}: {
    code: string;
}) {
    if (!code) {
        throw new Error("Code missing");
    }
    try {
        const res = await prisma.code.findFirst({
            where:{
                code: code
            },
            select:{
                id: true,
                code: true,
                used: true,
            }
        })
        if(!res){
            throw new Error("Code not found");
        }

        if(res.used){
            throw new Error("Code has already been used");
        }

        return { success: true, code: res.code };
    } catch (error) {
        console.error("Error verifying code: ", error);
        throw error;
    }
}

export async function createStakeholder({
    name,
    affiliation,
    email,
    password,
    projects = [],
    code = "",
}: {
    name: string;
    affiliation: string;
    email: string;
    password: string;
    projects: Projects[];
    code: string;
}) {
    if (!name || !email || !password) {
        throw new Error("Name, Affiliation, Email or Password required!");
    }

    try {
        const codeRecord = await prisma.code.findFirst({
            where: { code: code }
        });

        if (!codeRecord) {
            throw new Error("Invalid code");
        }

        if (codeRecord.used) {
            throw new Error("Code has already been used");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const manager = await prisma.managers.create({
            data: {
                name,
                affiliation,
                email,
                password: hashedPassword,
                projects: {
                    connect: projects.map((project) => ({ id: project.id })),
                },
                code,
            },
        });

        await prisma.code.update({
            where: { id: codeRecord.id },
            data: { used: true }
        });

        revalidatePath("/");
        return manager;
    } catch (error) {
        console.error("Error creating stakeholder user: ", error);
        throw error;
    }
}
