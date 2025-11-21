"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { addProjectToSection } from "../../../../../lib/sections";
import { error } from "console";

export async function PATCH(req: NextRequest, res: NextResponse) {
    console.log("PATCH CALLED")
    try {
        const body = await req.json();
        console.log(body);
        const { projectID, sectionID } = body;

        if (!projectID || !sectionID) {
            return NextResponse.json(
                { error: "projectID and sectionID are required" },
                { status: 400 }
            );
        }

        const response = await addProjectToSection(projectID, sectionID);
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