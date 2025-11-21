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
            },
            select: {
                id: true,
                email: true,
                name: true,
                major: true,
                year: true,
                gpa: true,
                skills: true,
                courses: true,
                graduation: true,
                applications: true,
                accepted: true,
                portfolio: true
            }

        })
        return student;
    } catch (error) {
        console.log("Error getting student by id");
        throw error;

    }
}

export async function updateStudentProfileByID(
    id: string, 
    newEmail?: string, 
    newYr?: string, 
    newGpa?: number,
    newSkill?: string, 
    newPort?: string, 
    newCourses?: string, 
    newGrad?: string){

    if (!id){
        throw new Error("student id needed")
    }
    try{
        const data: any = {};
        
        if (newEmail !== undefined){ 
            data.email = newEmail;
        }
        if (newYr !== undefined){ 
            data.year = newYr;
        }
        if (newGpa !== undefined){
            data.gpa = Number(newGpa);
        }
        if (newSkill !== undefined){
            data.skills = { 
                push: newSkill 
            };
        }
        if (newPort !== undefined){
            data.portfolio = newPort;
        }
        if (newCourses !== undefined){ 
            data.courses = { 
                push: newCourses 
            };
        }
        if (newGrad !== undefined){ 
            data.graduation = newGrad;
        }

        const updateStudentProfile = await prisma.students.update({
            where: {
                id: id
            },
            data,
        });
        revalidatePath('/');
        return updateStudentProfile;
        
    } catch(error){
        console.error("Error updating student", error);
        throw error;
    }
}

export async function getStudentByEmail(email: string){
    try{
        const student = await prisma.students.findUnique({
            where:{
                email: email
            },
            select: {
                id: true,
                email: true,
                name: true,
                major: true,
                year: true,
                gpa: true,
                skills: true,
                courses: true,
                graduation: true,
                applications: true,
                accepted: true,
                portfolio: true
            }

        })
        return student;
    } catch (error) {
        console.log("Error getting student by email");
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
        if(!email || !password || !name){
            throw new Error("Email, Password, or Name missing");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       
        try{

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
            throw error;
        }

    }

