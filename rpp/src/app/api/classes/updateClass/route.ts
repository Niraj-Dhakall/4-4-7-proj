"// /app/api/classes"
import { NextResponse, NextRequest } from "next/server";
import { updateClassByID } from "../../../../../lib/classes";
import { error } from "console";

export async function PATCH(req: NextRequest, res: NextResponse) {
    console.log("PATCH CALLED")
    try {
        const body = await req.json();
        console.log(body);
        const { id, newName, newSemester } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing required data!" },
                { status: 400 }
            );
        }

        const response = await updateClassByID(id, newName, newSemester);
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