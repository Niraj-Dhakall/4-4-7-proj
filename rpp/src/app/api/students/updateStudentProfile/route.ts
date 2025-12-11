"// /app/api/students"
import { NextResponse, NextRequest } from "next/server";
import { updateStudentProfileByID } from "../../../../../lib/students";
import { error } from "console";

export async function PATCH(req: NextRequest, res: NextResponse) {
    console.log("PATCH CALLED")
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