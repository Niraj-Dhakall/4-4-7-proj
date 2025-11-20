"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { remStudentFromSection } from "../../../../../lib/sections";


export async function PATCH(req: NextRequest) {
   
    try {
        const body = await req.json();
        
        const { studentID, sectionID } = body;

        if (!studentID || !sectionID) {
            return NextResponse.json(
                { error: "studentID and sectionID are required" },
                { status: 400 }
            );
        }

        const response = await remStudentFromSection(studentID, sectionID);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create section",
            },
            { status: 500 }
        );
    }
}