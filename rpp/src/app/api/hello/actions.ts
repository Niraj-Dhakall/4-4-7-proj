'INSERT SERVER HERE';

import prisma from '@/lib/prisma';
import { connect } from 'http2';
import { revalidatePath } from 'next/cache';

// READ Project post
export async function getProjects(limit = 5, cursor?: string){
    try{
        const projects = await prisma.projects.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? {date: new Date(cursor)} : undefined,
            orderBy: {
                date: 'desc'
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
                }
            }
        });
        return projects
    } catch(error){
        console.error("Error fetching projects:", error);
        throw error;
    }
}


export async function getProjectsByName(name: string){
    try{
        const project = await prisma.projects.findUnique({
            where: {
                name
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
                }
            }
        });
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
    friendly = false
} : {
    title: string; 
    description: string; 
    project_manager_id: string,
    tags: string[]                                 
    status: string; 
    friendly?: boolean}){

    if (!title || !description || !tags || !status){
        throw new Error("Title, description, tags, and/or status are missing!")
    }

    try{
        const managerExists = await prisma.mangers.findUnique({
            where: {
                id: project_manager_id,
            }
        })

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
                friendly
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
// MAY USE (IF NOT DELETE LATER)
/*
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
                }
            }
        });
        return project
    } catch(error){
        console.error("Error fetching projects:", error);
        throw error;
    }
}
*/