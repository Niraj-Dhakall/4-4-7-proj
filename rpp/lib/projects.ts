'// lib/projects.ts';

import prisma from './prisma';

import { revalidatePath } from 'next/cache';


export async function getProjects(limit = 5){
    try{
        const projects = await prisma.projects.findMany({
            take: limit,
            select: {
                id: true,
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
                id: true,
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
                id: true,
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
            return 
        }

        return project

    } catch(error){
        console.error("Error fetching projects:", error);
        throw error;
    }
}

export async function addStudentToProject(studentID: string, projectID: string){
    if (!studentID || !projectID){
        throw new Error("student/project id needed")
    }
    try{
        const project = await prisma.projects.update({
            where: {
                id: projectID
            },
            data: {
                student_app: {
                    push: studentID
                }
            }
        });
        revalidatePath('/');
        return project;
    }catch(error){
        console.error("Error adding student to project:", error);
        throw error;
    }
}

export async function checkStudentInProject(studentID: string, projectID: string){
     if (!studentID || !projectID){
        throw new Error("student/project id needed")
    }
    try{
        
        const project = await getProjectsById(projectID)
        if(project && project.student_app.includes(studentID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.error("Error checking student in project:", error);
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

