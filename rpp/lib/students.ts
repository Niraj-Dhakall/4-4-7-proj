'// lib/students.ts';

import prisma from './prisma';
import { connect } from 'http2';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function getStudentByID(id: string){
    try{
        const student = await prisma.students.findUnique({
            where:{
                id: id
            }

        })
        return student;
    } catch (error) {
        console.log("Error getting student by id");
        throw error;

    }
}

export async function addStudent(data: {
    email: string;
    password: string;
    name: string;
    major?: string[];
    year?: string;
    gpa?: number;
    skills?: string[];
    courses?: string[];
    graduation?: string;
    applications?: string[];
    accepted?: any[];
    portfolio?: string[];
}){
        const {
            email,
            password,
            name,
            major = [],
            year = "n/a",
            gpa = 0.0,
            skills = [],
            courses = [],
            graduation = "TBD",
            applications = [],
            accepted = [],
            portfolio
        } = data;

        if(!email || !password || !name || !major || !year || !gpa){
            throw new Error("Email, Password, Name, Major, Year, Or GPA missing");
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("37")
        try{
            console.log("39")
            const student = await prisma.students.create({

                data:{
                    email,
                    password: hashedPassword,
                    name,
                    major,
                    year,
                    gpa,
                    skills,
                    courses,
                    graduation,
                    applications,
                    accepted,
                    portfolio: portfolio ?? null,

                }
            })
            return student;
        }catch(error){
            return error;
        }

    }