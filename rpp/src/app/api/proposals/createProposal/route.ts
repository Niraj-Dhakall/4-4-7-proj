"// /app/api/proposals";
import { NextResponse, NextRequest } from "next/server";
import { createProject } from "../../../../../lib/projects";

export async function POST(req: NextRequest) {
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
