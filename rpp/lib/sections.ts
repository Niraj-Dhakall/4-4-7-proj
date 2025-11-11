'// lib/sections.ts';

import prisma from './prisma';
import { connect } from 'http2';
import { revalidatePath } from 'next/cache';

export async function getSections(){
    try{
        const sections = await prisma.section.findMany({
            select: {
                id: true,
                sec_number: true,
                time: true,
                days: true,
                projects: true,
                students: true,
                student_count: true,
                group_count: true,
                class: {
                    select: {
                        name: true,
                        semester: true
                    }
                }
            }
        });
        return sections
        
    } catch(error){
        console.error("Error fetching sections:", error);
        throw error;
    }
}

export async function createSection({
    sec_number, 
    time, 
    days,
    location, 
    projects = [], 
    students = [],
    groups = [],
    student_count = 0,
    group_count = 0,
    class_id
} : {
    sec_number: number;
    time: string; 
    days: string;
    location: string;
    projects: string[];
    students:string[];
    groups: string[],
    student_count: number,
    group_count: number,
    class_id: string;
    }){

    if (!sec_number || !time || !days || !location){
        throw new Error("Section number, time of section, days of section, and/or location of section are missing!")
    }
   
    try{
        const classExists = await prisma.class.findUnique({
            where: {
                id: class_id,
            }
        });

        if (!classExists){
            throw new Error("Class not found")
        }

        const section = await prisma.section.create({
            data:{
                sec_number,
                time,
                days,
                location,
                projects,
                students,
                groups,
                student_count,
                group_count,
                class: {
                    connect: {id: class_id}
                },
            },
            include: {
                class: true
            } 
        });
        revalidatePath('/');
        return section

    } catch(error){
        throw error;
    }
}
