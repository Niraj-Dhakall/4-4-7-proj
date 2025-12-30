"// /app/api/students"
import { NextResponse, NextRequest } from "next/server";
import { updateStudentProfileByID } from "../../../../../lib/students";
import { error } from "console";
import { requireRole } from "../../../../../lib/auth";

export async function PATCH(req: NextRequest, res: NextResponse) {
    const { error, session } = await requireRole(["admin", "student"])
                                                
    if (error) {
        return error;
    }
    
    try {
        const body = await req.json();
        console.log(body);
        const { id, newEmail, newYr, newGpa, newSkill, newPort, newCourses, newGrad, newMajor, newSkills } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing required data!" },
                { status: 400 }
            );
        }

        const response = await updateStudentProfileByID(id, newEmail, newYr, newGpa, newSkill, newPort, newCourses, newGrad, newMajor, newSkills);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update section",
            },
            { status: 500 }
        );
    }
}