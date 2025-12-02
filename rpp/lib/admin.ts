import prisma from "./prisma";

export async function getAdminDetails({ id }: { id: string }) {
    if (!id) {
        throw new Error("Admin ID required");
    }
    try {
        const admin = prisma.admin.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                projects: true,
            },
        });
        return admin;
    } catch (error) {
        console.log("Error when getting admin details", error);
        return error;
    }
}
