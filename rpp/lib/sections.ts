"// lib/sections.ts";

import prisma from "./prisma";

import { revalidatePath } from "next/cache";

export async function generateSectionCode(): Promise<string> {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    const codeCheck = await prisma.section.findFirst({
        where: {
            code: code,
        },
    });
    if (codeCheck) {
        generateSectionCode();
    }
    return code;
}

export async function getSections() {
    try {
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
                        semester: true,
                    },
                },
            },
        });
        return sections;
    } catch (error) {
        console.error("Error fetching sections:", error);
        throw error;
    }
}
export async function getSectionByCode(code: string) {
    try {
        const section = await prisma.section.findFirst({
            where: {
                code: code,
            },
            select: {
                id: true,
            },
        });
        return section;
    } catch (e) {
        console.error("Error getting section by code", e);
        throw e;
    }
}
export async function getSectionById(id: string) {
    try {
        const sections = await prisma.section.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                sec_number: true,
                time: true,
                days: true,
                projects: true,
                location: true,
                students: true,
                groups: true,
                student_count: true,
                group_count: true,
                class: {
                    select: {
                        name: true,
                        semester: true,
                    },
                },
            },
        });
        return sections;
    } catch (error) {
        console.error("Error fetching sections:", error);
        throw error;
    }
}

// Student Portion of Section
export async function addStudentToSection(
    studentID: string,
    sectionID: string
) {
    if (!studentID || !sectionID) {
        throw new Error("student/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });
        console.log("SECTION", sectionExists);
        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const studentExists = await prisma.students.findUnique({
            where: {
                id: studentID,
            },
        });

        if (!studentExists) {
            throw new Error("Student not found");
        }

        const studentInSection = sectionExists.students.includes(studentID);

        if (studentInSection) {
            throw new Error("Student already in section");
        }

        const section = await prisma.section.update({
            where: {
                id: sectionID,
            },
            data: {
                students: {
                    push: studentID,
                },
                student_count: {
                    increment: 1,
                },
            },
        });
        revalidatePath("/");
        return section;
    } catch (error) {
        console.error("Error adding student to section:", error);
        throw error;
    }
}

export async function remStudentFromSection(
    studentID: string,
    sectionID: string
) {
    if (!studentID || !sectionID) {
        throw new Error("student/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const studentExists = await prisma.students.findUnique({
            where: {
                id: studentID,
            },
        });

        if (!studentExists) {
            throw new Error("Student not found");
        }

        const studentInSection =
            await sectionExists.students.includes(studentID);

        if (!studentInSection) {
            throw new Error("Student not in section");
        }

        const updatedStudents = await sectionExists.students.filter(
            (id) => id !== studentID
        );

        const updatedSection = await prisma.section.update({
            where: {
                id: sectionID,
            },
            data: {
                students: {
                    set: updatedStudents,
                },
                student_count: {
                    decrement: 1,
                },
            },
        });

        revalidatePath("/");
        return updatedSection;
    } catch (error) {
        console.error("Error adding student to section:", error);
        throw error;
    }
}

export async function checkStudentInSection(
    studentID: string,
    sectionID: string
) {
    if (!studentID || !sectionID) {
        throw new Error("student/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const studentExists = await prisma.students.findUnique({
            where: {
                id: studentID,
            },
        });

        if (!studentExists) {
            throw new Error("Student not found");
        }

        const section = await getSectionById(sectionID);
        if (section && section.students.includes(studentID)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking student in project:", error);
        throw error;
    }
}

export async function checkAllStudentsInSection(sectionID: string) {
    if (!sectionID) {
        throw new Error("section id needed");
    }
    try {
        const sections = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
            select: {
                students: true,
            },
        });

        if (!sections) {
            throw new Error("Section not found");
        }

        const students = await prisma.students.findMany({
            where: {
                id: {
                    in: sections.students,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                major: true,
                year: true,
                gpa: true,
                skills: true,
                courses: true,
                graduation: true,
                applications: true,
                accepted: true,
                portfolio: true,
            },
        });

        return students;
    } catch (error) {
        console.error("Error checking student in project:", error);
        throw error;
    }
}

// Group Portion of Section
export async function addGroupToSection(groupID: string, sectionID: string) {
    if (!groupID || !sectionID) {
        throw new Error("group/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const groupExists = await prisma.groups.findUnique({
            where: {
                id: groupID,
            },
        });

        if (!groupExists) {
            throw new Error("Group not found");
        }

        const groupInSection = await sectionExists.groups.includes(groupID);

        if (groupInSection) {
            throw new Error("Group already in section");
        }

        const section = await prisma.section.update({
            where: {
                id: sectionID,
            },
            data: {
                groups: {
                    push: groupID,
                },
                group_count: {
                    increment: 1,
                },
            },
        });
        revalidatePath("/");
        return section;
    } catch (error) {
        console.error("Error adding group to section:", error);
        throw error;
    }
}

export async function remGroupFromSection(groupID: string, sectionID: string) {
    if (!groupID || !sectionID) {
        throw new Error("group/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const groupExists = await prisma.groups.findUnique({
            where: {
                id: groupID,
            },
        });

        if (!groupExists) {
            throw new Error("Group not found");
        }

        const groupInSection = await sectionExists.groups.includes(groupID);

        if (!groupInSection) {
            throw new Error("Group not in section");
        }

        const updatedGroups = await sectionExists.groups.filter(
            (id) => id !== groupID
        );

        const updatedSection = await prisma.section.update({
            where: {
                id: sectionID,
            },
            data: {
                groups: {
                    set: updatedGroups,
                },
                group_count: {
                    decrement: 1,
                },
            },
        });

        revalidatePath("/");
        return updatedSection;
    } catch (error) {
        console.error("Error removing group from section:", error);
        throw error;
    }
}

export async function checkGroupInSection(groupID: string, sectionID: string) {
    if (!groupID || !sectionID) {
        throw new Error("group/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const groupExists = await prisma.groups.findUnique({
            where: {
                id: groupID,
            },
        });

        if (!groupExists) {
            throw new Error("Group not found");
        }

        const section = await getSectionById(sectionID);
        if (section && section.groups.includes(groupID)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking group in section:", error);
        throw error;
    }
}

export async function checkAllGroupsInSection(sectionID: string) {
    if (!sectionID) {
        throw new Error("section id needed");
    }
    try {
        const sections = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
            select: {
                groups: true,
            },
        });

        if (!sections) {
            throw new Error("Section not found");
        }

        const group = await prisma.groups.findMany({
            where: {
                id: {
                    in: sections.groups,
                },
            },
            select: {
                id: true,
                name: true,
                group_master_id: true,
                members: true,
                member_count: true,
                group_master: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return group;
    } catch (error) {
        console.error("Error checking all groups in section:", error);
        throw error;
    }
}

// Project Portion of Section
export async function addProjectToSection(
    projectID: string,
    sectionID: string
) {
    if (!projectID || !sectionID) {
        throw new Error("project/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const projectExists = await prisma.projects.findUnique({
            where: {
                id: projectID,
            },
        });

        if (!projectExists) {
            throw new Error("Project not found");
        }

        const projectInSection =
            await sectionExists.projects.includes(projectID);

        if (projectInSection) {
            throw new Error("Group already in section");
        }

        const section = await prisma.section.update({
            where: {
                id: sectionID,
            },
            data: {
                projects: {
                    push: projectID,
                },
            },
        });
        revalidatePath("/");
        return section;
    } catch (error) {
        console.error("Error adding project to section:", error);
        throw error;
    }
}

export async function remProjectFromSection(
    projectID: string,
    sectionID: string
) {
    if (!projectID || !sectionID) {
        throw new Error("project/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const projectExists = await prisma.projects.findUnique({
            where: {
                id: projectID,
            },
        });

        if (!projectExists) {
            throw new Error("Project not found");
        }

        const projectInSection =
            await sectionExists.projects.includes(projectID);

        if (!projectInSection) {
            throw new Error("Project not in section");
        }

        const updatedProjects = await sectionExists.projects.filter(
            (id) => id !== projectID
        );

        const updatedSection = await prisma.section.update({
            where: {
                id: sectionID,
            },
            data: {
                projects: {
                    set: updatedProjects,
                },
            },
        });

        revalidatePath("/");
        return updatedSection;
    } catch (error) {
        console.error("Error removing project from section:", error);
        throw error;
    }
}

export async function checkProjectInSection(
    projectID: string,
    sectionID: string
) {
    if (!projectID || !sectionID) {
        throw new Error("project/section id needed");
    }
    try {
        const sectionExists = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
        });

        if (!sectionExists) {
            throw new Error("Section not found");
        }

        const projectExists = await prisma.projects.findUnique({
            where: {
                id: projectID,
            },
        });

        if (!projectExists) {
            throw new Error("Project not found");
        }

        const section = await getSectionById(sectionID);
        if (section && section.projects.includes(projectID)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking project in section:", error);
        throw error;
    }
}

export async function checkAllProjectsInSection(sectionID: string) {
    if (!sectionID) {
        throw new Error("section id needed");
    }
    try {
        const sections = await prisma.section.findUnique({
            where: {
                id: sectionID,
            },
            select: {
                projects: true,
            },
        });

        if (!sections) {
            throw new Error("Section not found");
        }

        const project = await prisma.projects.findMany({
            where: {
                id: {
                    in: sections.projects,
                },
            },
            select: {
                project_manager_id: true,
                title: true,
                description: true,
                tags: true,
                date: true,
                status: true,
                friendly: true,
            },
        });

        return project;
    } catch (error) {
        console.error("Error checking all projects in section:", error);
        throw error;
    }
}

export async function updateSectionByID(
    id: string,
    newSecNum: number,
    newTime: string,
    newDays: string,
    newLoc: string
) {
    if (!id) {
        throw new Error("section id needed");
    }
    try {
        const data: any = {};

        if (newSecNum !== undefined) {
            data.sec_number = newSecNum;
        }
        if (newTime !== undefined) {
            data.time = newTime;
        }
        if (newDays !== undefined) {
            data.days = newDays;
        }
        if (newLoc !== undefined) {
            data.location = newLoc;
        }

        const updateSection = await prisma.section.update({
            where: {
                id: id,
            },
            data,
        });
        revalidatePath("/");
        return updateSection;
    } catch (error) {
        console.error("Error updating section", error);
        throw error;
    }
}

export async function delSectionByID(id: string) {
    if (!id) {
        throw new Error("class id needed");
    }
    try {
        const deleteSection = await prisma.section.delete({
            where: {
                id: id,
            },
        });

        return deleteSection;
    } catch (error) {
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
    class_id,
}: {
    sec_number: number;
    time: string;
    days: string;
    location: string;
    projects: string[];
    students: string[];
    groups: string[];
    student_count: number;
    group_count: number;
    class_id: string;
}) {
    if (!sec_number || !time || !days || !location) {
        throw new Error(
            "Section number, time of section, days of section, and/or location of section are missing!"
        );
    }

    try {
        const classExists = await prisma.class.findUnique({
            where: {
                id: class_id,
            },
        });

        if (!classExists) {
            throw new Error("Class not found");
        }
        const code = await generateSectionCode();
        const section = await prisma.section.create({
            data: {
                sec_number,
                time,
                days,
                location,
                projects,
                students,
                groups,
                student_count,
                group_count,
                code,
                class: {
                    connect: { id: class_id },
                },
            },
            include: {
                class: true,
            },
        });
        revalidatePath("/");
        return section;
    } catch (error) {
        throw error;
    }
}
