"// /app/api/classes"
import { NextResponse, NextRequest } from "next/server";
import { updateClassByID } from "../../../../../lib/classes";
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, newName, newSemester } = body;
        if (!id || !newName || !newSemester) {
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