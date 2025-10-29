'// lib/stakeholders.ts';

import { Projects } from '@prisma/client';
import prisma from './prisma';
import { connect } from 'http2';
import { revalidatePath } from 'next/cache';
import { Project } from 'next/dist/build/swc/types';


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
            return -1
            // throw new Error("Stakeholder does not exist!")
        }

        return manager

    } catch(error){
        console.error("Error fetching user:", error);
        throw error;
    }
}


export async function createStakeholder({
    name, 
    affiliation, 
    email,
    password, 
    projects = [],
    code = "" 
} : {
    name: string; 
    affiliation: string; 
    email: string;
    password: string;                              
    projects: Projects[]; 
    code: string; 
    }){

    if (!name || !email){
        throw new Error("Name, Affiliation, Email or Password!")
    }
   
    try{
        const manager = await prisma.managers.create({
            data:{
                name,
                affiliation,
                email,
                password,
                projects: {
                    connect: projects.map(project => ({ id: project.id }))
                },
                code
            }
        });
        revalidatePath('/');
        return manager

    } catch(error){
        console.error("Error creating stakeholder user: ", error);
        throw error;
    }
}

