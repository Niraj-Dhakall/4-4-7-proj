"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { addGroupToSection } from "../../../../../lib/sections";
import { error } from "console";

export async function PATCH(req: NextRequest, res: NextResponse) {
    console.log("PATCH CALLED")
    try {
        const body = await req.json();
        console.log(body);
        const { groupID, sectionID } = body;

        if (!groupID || !sectionID) {
            return NextResponse.json(
                { error: "groupID and sectionID are required" },
                { status: 400 }
            );
        }

        const response = await addGroupToSection(groupID, sectionID);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to add group to section",
            },
            { status: 500 }
        );
    }
}