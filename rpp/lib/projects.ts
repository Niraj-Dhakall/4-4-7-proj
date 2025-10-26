'// lib/projects.ts';

import prisma from './prisma';
import { connect } from 'http2';
import { revalidatePath } from 'next/cache';

// READ Project post
export async function getProjects(limit = 5){
    try{
        const projects = await prisma.projects.findMany({
            take: limit,
            select: {
                title: true,
                date: true,
                description: true,
                tags: true,
                status: true,
                friendly: true,
                project_manager: {
                    select: {
                        name: true,
                        email: true,
                        affiliation: true,
                    }
                },
                student_accepted: true,
                student_app: true
            }
        });
        return projects
        
    } catch(error){
        console.error("Error fetching projects:", error);
        throw error;
    }
}



export async function getProjectsByName(title: string){
    try{
        const project = await prisma.projects.findMany({
            where: {
                title
            },
            select: {
                title: true,
                date: true,
                description: true,
                tags: true,
                status: true,
                friendly: true,
                project_manager: {
                    select: {
                        name: true,
                        email: true,
                        affiliation: true,
                    }
                },
                student_accepted: true,
                student_app: true
            }
        });

        if (!project){
            throw new Error("Project does not exist!")
        }

        return project

    } catch(error){
        console.error("Error fetching projects:", error);
        throw error;
    }
}


export async function getProjectsById(id: string){
    try{
        const project = await prisma.projects.findUnique({
            where: {
                id
            },
            select: {
                title: true,
                date: true,
                description: true,
                tags: true,
                status: true,
                friendly: true,
                project_manager: {
                    select: {
                        name: true,
                        email: true,
                        affiliation: true,
                    }
                },
                student_accepted: true,
                student_app: true
            }
        });

        if (!project){
            throw new Error("Project does not exist!")
        }

        return project

    } catch(error){
        console.error("Error fetching projects:", error);
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
        throw error;
    }
}

