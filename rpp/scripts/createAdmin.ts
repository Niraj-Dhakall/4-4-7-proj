import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: "samit1@umbc.edu" },
        });

        if (existingAdmin) {
            console.log("Admin user already exists!");
            return;
        }

        
        const hashedPassword = await bcrypt.hash("samit1RPPpassword", 10);

        
        const admin = await prisma.admin.create({
            data: {
                name: "Samit Shivadekar",
                email: "samit1@umbc.edu",
                password: hashedPassword,
            },
        });


    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
