'// lib/sections.ts';

import prisma from './prisma';

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

export async function getSectionById(id: string){
    try{
        const sections = await prisma.section.findUnique({
            where: {
                id
            },
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

export async function addStudentToSection(studentID: string, sectionID: string){
    if (!studentID || !sectionID){
        throw new Error("student/section id needed")
    }
    try{
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            }
        });

        if (!sectionExists){
            throw new Error("Section not found")
        }

        const studentExists = await prisma.students.findUnique({
            where: {
                id: studentID,
            }
        });

        if (!studentExists){
            throw new Error("Student not found")
        }

        const studentInSection = await sectionExists.students.includes(studentID);

        if (studentInSection){
            throw new Error("Student already in section")
        }

        const section = await prisma.section.update({
            where: {
                id: sectionID
            },
            data: {
                students: {
                    push: studentID
                },
                student_count: { 
                    increment: 1
                }
            }
        });
        revalidatePath('/');
        return section;
    }catch(error){
        console.error("Error adding student to section:", error);
        throw error;
    }
}

export async function remStudentFromSection(studentID: string, sectionID: string){
    if (!studentID || !sectionID){
        throw new Error("student/section id needed")
    }
    try{
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            }
        });

        if (!sectionExists){
            throw new Error("Section not found")
        }

        const studentExists = await prisma.students.findUnique({
            where: {
                id: studentID,
            }
        });

        if (!studentExists){
            throw new Error("Student not found")
        }

        const studentInSection = await sectionExists.students.includes(studentID);

        if (!studentInSection){
            throw new Error("Student not in section")
        }

        
        const updatedStudents = await sectionExists.students.filter(id => id !== studentID);

        const updatedSection = await prisma.section.update({
            where: {
                id: sectionID
            },
            data: {
                students: {
                    set: updatedStudents
                },
                student_count: {
                    decrement: 1
                }
            }
        })

        revalidatePath('/');
        return updatedSection;
    }catch(error){
        console.error("Error adding student to section:", error);
        throw error;
    }
}

export async function checkStudentInSection(studentID: string, sectionID: string){
     if (!studentID || !sectionID){
        throw new Error("student/section id needed")
    }
    try{
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            }
        });

        if (!sectionExists){
            throw new Error("Section not found")
        }

        const studentExists = await prisma.students.findUnique({
            where: {
                id: studentID,
            }
        });

        if (!studentExists){
            throw new Error("Student not found")
        }

        const section = await getSectionById(sectionID)
        if(section && section.students.includes(studentID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.error("Error checking student in project:", error);
        throw error;
    }
}

export async function checkAllStudentsInSection(sectionID: string){
     if (!sectionID){
        throw new Error("section id needed")
    }
    try{
        const sections = await prisma.section.findUnique({
            where: {
                id: sectionID
            },
            select: {
                students: true
            }
        });

        if (!sections){
            throw new Error("Section not found")
        }
        
        const students = await prisma.students.findMany({
            where: {
                id: {
                    in: sections.students
                }
            },
            select: {
                name: true,
                email: true
            }
        })

        return students
        
        
    }catch(error){
        console.error("Error checking student in project:", error);
        throw error;
    }
}

export async function updateSectionByID(id: string, newSecNum: number, newTime: string, newDays: string, newLoc: string){
    if (!id){
        throw new Error("section id needed")
    }
    try{
        const updateSection = await prisma.section.update({
            where: {
                id: id
            },
            data: {
                sec_number: newSecNum,
                time: newTime,
                days: newDays,
                location: newLoc
            }
        });
        revalidatePath('/');
        return updateSection;
        
    } catch(error){
        console.error("Error updating section", error);
        throw error;
    }
}

export async function delSectionByID(id: string){
    if (!id){
        throw new Error("class id needed")
    }
    try{
        const deleteSection = await prisma.section.delete({
            where: {
                id: id
            }
        });

        return deleteSection
        
    } catch(error){
        console.error("Error deleting class", error);
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
