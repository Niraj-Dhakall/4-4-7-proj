'// lib/classes.ts';

import { Section } from '@prisma/client';
import prisma from './prisma';
import { connect } from 'http2';
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
