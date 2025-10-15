'// lib/stakeholders.ts';

import prisma from './prisma';
import { connect } from 'http2';
import { revalidatePath } from 'next/cache';


export async function getStakeholdersById(id: string){
    try{
        const manager = await prisma.managers.findUnique({
            where: {
                id
            },
            select: {
                name: true,
                affiliation: true,
                email: true,
                projects: true,
            }
        });

        if (!manager){
            throw new Error("Stakeholder does not exist!")
        }

        return manager

    } catch(error){
        console.error("Error fetching user:", error);
        throw error;
    }
}


export async function createProject({
    title, 
    description, 
    project_manager_id,
    tags, 
    status, 
    friendly = false,
    student_app = [],
    student_accepted = []
} : {
    title: string; 
    description: string; 
    project_manager_id: string;
    tags: string[];                              
    status: string; 
    friendly?: boolean; 
    student_app: string[];
    student_accepted: string[];
    }){

    if (!title || !description || !tags || !status){
        throw new Error("Title, description, tags, and/or status are missing!")
    }
   
    try{
        const managerExists = await prisma.managers.findUnique({
            where: {
                id: project_manager_id,
            }
        });

        if (!managerExists){
            throw new Error("Manager not found")
        }

        const project = await prisma.projects.create({
            data:{
                title,
                description,
                project_manager: {
                    connect: {id: project_manager_id}
                },
                tags,
                status,
                friendly,
                student_app,
                student_accepted
            },
            include: {
                project_manager: true
            } 
        });
        revalidatePath('/');
        return project

    } catch(error){
        console.error("Error creating project post: ", error);
        throw error;
    }
}

