"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { updateSectionByID } from "../../../../../lib/sections";


export async function PATCH(req: NextRequest) {
   
    try {
        const body = await req.json();
        const { id, newSecNum, newTime, newDays, newLoc } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing required data!" },
                { status: 400 }
            );
        }

        const response = await updateSectionByID(id, newSecNum, newTime, newDays, newLoc);
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