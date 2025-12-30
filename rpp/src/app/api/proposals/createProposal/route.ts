"// /app/api/proposals";
import { NextResponse, NextRequest } from "next/server";
import { createProject } from "../../../../../lib/projects";
import { requireRole } from "../../../../../lib/auth";

export async function POST(req: NextRequest) {
    const { error, session } = await requireRole(["admin", "stakeholder"])
                
    if (error) {
        return error;
    }

    try {
        const body = await req.json();
        const response = await createProject(body);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create project proposal",
            },
            { status: 500 }
        );
    }
}
