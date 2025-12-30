"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { remGroupFromSection } from "../../../../../lib/sections";
import { error } from "console";
import { requireRole } from "../../../../../lib/auth";

export async function PATCH(req: NextRequest, res: NextResponse) {
    const { error, session } = await requireRole(["admin"])
                        
    if (error) {
        return error;
    }
    
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

        const response = await remGroupFromSection(groupID, sectionID);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete group from section",
            },
            { status: 500 }
        );
    }
}