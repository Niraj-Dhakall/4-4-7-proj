"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { addStudentToSection } from "../../../../../lib/sections";
import { error } from "console";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("POST CALLED CREATE")
    try {
        const body = await req.json();
        console.log(body);
        const { studentID, sectionID } = body;

        if (!studentID || !sectionID) {
            return NextResponse.json(
                { error: "studentID and sectionID are required" },
                { status: 400 }
            );
        }

        const response = await addStudentToSection(studentID, sectionID);
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