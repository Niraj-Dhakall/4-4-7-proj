"// lib/classes.ts";

import { Section } from "@prisma/client";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function getClass() {
    try {
        const classes = await prisma.class.findMany({
            select: {
                id: true,
                name: true,
                semester: true,
                sections: true,
            },
        });
        return classes;
    } catch (error) {
        console.error("Error fetching class", error);
        throw error;
    }
}

export async function getClassByID(id: string) {
    if (!id) {
        throw new Error("Class ID is needed");
    }
    try {
        const c = await prisma.class.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                sections: true,
                semester: true,
            },
        });
        return c;
    } catch (error) {
        console.error("Error getting class by ID", error);
        throw error;
    }
}
export async function getClassByNameAndSemester(
    name: string,
    semester: string
) {
    if (!name || !semester) {
        throw new Error("Name and semester are required");
    }
    try {
        const classData = await prisma.class.findFirst({
            where: {
                name: name,
                semester: semester,
            },
            select: {
                id: true,
                name: true,
                semester: true,
                sections: true,
            },
        });
        return classData;
    } catch (error) {
        console.error("Error fetching class by name and semester", error);
        throw error;
    }
}

export async function delClassByID(id: string) {
    if (!id) {
        throw new Error("class id needed");
    }
    try {
        const deleteClass = await prisma.class.delete({
            where: {
                id: id,
            },
        });

        return deleteClass;
    } catch (error) {
        console.error("Error fetching class", error);
        throw error;
    }
}

export async function updateClassByID(
    id: string,
    newName: string,
    newSemester: string
) {
    if (!id) {
        throw new Error("class id needed");
    }
    try {
        const data: any = {};

        if (newName !== undefined) {
            data.name = newName;
        }
        if (newSemester !== undefined) {
            data.semester = newSemester;
        }

        const updateClass = await prisma.class.update({
            where: {
                id: id,
            },
            data,
        });
        revalidatePath("/");
        return updateClass;
    } catch (error) {
        console.error("Error fetching class", error);
        throw error;
    }
}

export async function createClass({
    name,
    semester,
    sections = [],
}: {
    name: string;
    semester: string;
    sections?: Section[];
}) {
    if (!name || !semester) {
        throw new Error("Name of class and/or semester are missing!");
    }

    try {
        const classes = await prisma.class.create({
            data: {
                name,
                semester,
                ...(sections.length > 0 && {
                    sections: {
                        connect: sections.map((section) => ({
                            id: section.id,
                        })),
                    },
                }),
            },
        });
        revalidatePath("/");
        return classes;
    } catch (error) {
        throw error;
    }
}
