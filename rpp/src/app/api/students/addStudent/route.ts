import { NextResponse, NextRequest } from "next/server";
import { addStudent } from "../../../../../lib/students";
import { requireRole } from "../../../../../lib/auth";

export async function POST(req: NextRequest) {
    const { error, session } = await requireRole(["admin", "student"])
                                        
    if (error) {
        return error;
    }

    try {
        const body = await req.json();
        const response = await addStudent(body);

        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create account",
            },
            { status: 500 }
        );
    }
}
