
import prisma from "./prisma";

export async function findDupeGroup({ name }: { name: string }) {
    try {
        const dupe = await prisma.groups.findFirst({
            where: {
                name: name,
            },
        });
        if (dupe) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        throw new Error("Error finding duplicate groups");
    }
}
export async function findUniqueGroup({ id }: { id: string }) {
    try {
        const dupe = await prisma.groups.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
            },
        });
        if (dupe) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        throw new Error("Error finding duplicate groups");
    }
}
export async function createGroup({
    name,
    group_master_id,
}: {
    name: string;
    group_master_id: string;
}) {
    if (!name || !group_master_id) {
        throw new Error("Name and/or group leader id needed.");
    }
    if (await findDupeGroup({ name })) {
        return {
            success: false,
            error: "GROUP_EXISTS",
            message: "A group with this name already exists"
        };
    }
    try {
        const group = await prisma.groups.create({
            data: {
                name: name,
                group_master_id: group_master_id,

                members: [group_master_id],
                member_count: 1,
            },
        });
        return { success: true, data: group };
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
}
export async function getGroupByName({ name }: { name: string }) {
    if (!name) {
        throw new Error("Name required");
    }
    try {
        const group = await prisma.groups.findFirst({
            where: {
                name: name,
            },
            select: {
                id: true,
                name: true,
                member_count: true,
                members: true,
                group_master: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
            },
        });
        return group;
    } catch (error) {
        console.error("Error getting group:", error);
        throw error;
    }
}
export async function getGroupByID({ id }: { id: string }) {
    if (!id) {
        throw new Error("id required");
    }
    try {
        const group = await prisma.groups.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                member_count: true,
                members: true,
                group_master: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
            },
        });
        return group;
    } catch (error) {
        console.error("Error getting group:", error);
        throw error;
    }
}

export async function checkStudentInGroup({
    studentID,
    groupID,
}: {
    studentID: string;
    groupID: string;
}) {
    try {
        const dupe = await prisma.groups.findUnique({
            where: {
                id: groupID,
            },
            select:{
                members: true,
            }
        });
        if (dupe?.members.includes(studentID)) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        throw new Error("Error checking student in group");
    }
}
export async function joinGroup({
    studentID,
    groupID,
    groupName,
}: {
    studentID: string;
    groupID: string;
    groupName?: string;
}) {
  
    if (!studentID || !groupID) {
        throw new Error("Group ID and/or Student ID missing");
    }
    try {
        if (!(await findUniqueGroup({ id: groupID }))) {
            throw new Error("Group does not exist");
        }
        if(await checkStudentInGroup({studentID, groupID})){
            return {
            success: false,
            error: "STUDENT_EXISTS_IN_GROUP",
            message: "Student is already in"
        };
        }
        const group = await prisma.groups.update({
            where:{
                id: groupID
            },
            data:{
                members:{
                    push: studentID
                },
                member_count: {
                    increment: 1
                }
            }
        })
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
