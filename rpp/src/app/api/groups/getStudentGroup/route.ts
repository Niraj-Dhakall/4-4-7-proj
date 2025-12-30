import { NextResponse, NextRequest } from "next/server";
import { getStudentGroup } from "../../../../../lib/groups";
import { requireRole } from "../../../../../lib/auth";


export async function GET(req: NextRequest) {
    const { error, session } = await requireRole(["admin", "student", "stakeholder"])
                    
    if (error) {
        return error;
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Student ID is required" },
                { status: 400 }
            );
        }

        const group = await getStudentGroup(id);
        return NextResponse.json(group, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch student group",
            },
            { status: 500 }
        );
    }
}
