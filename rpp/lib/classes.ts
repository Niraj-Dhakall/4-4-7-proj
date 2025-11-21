'// lib/classes.ts';

import { Section } from '@prisma/client';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';

export async function getClass(){
    try{
        const classes = await prisma.class.findMany({
            select: {
                id: true,
                name: true,
                semester: true,
                sections: true
            }
        });
        return classes
        
    } catch(error){
        console.error("Error fetching class", error);
        throw error;
    }
}

export async function delClassByID(id: string){
    if (!id){
        throw new Error("class id needed")
    }
    try{
        const deleteClass = await prisma.class.delete({
            where: {
                id: id
            }
        });

        return deleteClass
        
    } catch(error){
        console.error("Error fetching class", error);
        throw error;
    }
}

export async function updateClassByID(id: string, newName: string, newSemester: string){
    if (!id){
        throw new Error("class id needed")
    }
    try{
        const data: any = {}
        
        if (newName !== undefined){ 
            data.name = newName;
        }
        if (newSemester !== undefined){ 
            data.semester = newSemester;
        }

        const updateClass = await prisma.class.update({
            where: {
                id: id
            },
            data,
        });
        revalidatePath('/');
        return updateClass;
        
    } catch(error){
        console.error("Error fetching class", error);
        throw error;
    }
}

export async function createClass({
    name,
    semester,
    sections = []
} : {
    name: string;
    semester: string;
    sections: Section[];
    }){

    if (!name || !semester){
        throw new Error("Name of class and/or semester are missing!")
    }
   
    try{
        const classes = await prisma.class.create({
            data:{
                name,
                semester,
                sections: {
                    connect: sections.map(section => ({ id: section.id }))
                }
            }
        });
        revalidatePath('/');
        return classes

    } catch(error){
        throw error;
    }
}

