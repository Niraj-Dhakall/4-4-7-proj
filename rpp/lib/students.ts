'// lib/students.ts';

import prisma from './prisma';
import { connect } from 'http2';
import { revalidatePath } from 'next/cache';

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

        if(!name || !major || !year || !gpa){
            throw new Error("Name, Major, Year, Or GPA missing");
        }
        console.log("37")
        try{
            console.log("39")
            const student = await prisma.students.create({
                
                data:{
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