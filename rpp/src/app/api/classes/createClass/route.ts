"// /app/api/classes";
import { NextResponse, NextRequest } from "next/server";
import { requireRole } from "../../../../../lib/auth";
import { createClass } from "../../../../../lib/classes";

export async function POST(req: NextRequest) {
    const { error, session } = await requireRole(["admin"])
        
    if (error) {
        return error;
    }

    try {
        const body = await req.json();
        const response = await createClass(body);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create class",
            },
            { status: 500 }
        );
    }
}