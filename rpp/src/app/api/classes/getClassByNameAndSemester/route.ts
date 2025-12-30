"// /app/api/classes/getClassByNameAndSemester";
import { NextResponse, NextRequest } from "next/server";
import { getClassByNameAndSemester } from "../../../../../lib/classes";
import { requireRole } from "../../../../../lib/auth";


export async function POST(req: NextRequest) {
    const { error, session } = await requireRole(["admin", "student"])
            
    if (error) {
        return error;
    }

    try {
        const body = await req.json();
        const { name, semester } = body;

        if (!name || !semester) {
            return NextResponse.json(
                { error: "Name and semester are required" },
                { status: 400 }
            );
        }

        const response = await getClassByNameAndSemester(name, semester);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to get class",
            },
            { status: 500 }
        );
    }
}
