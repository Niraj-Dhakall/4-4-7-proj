"// /app/api/sections";
import { NextResponse, NextRequest } from "next/server";
import { createSection } from "../../../../../lib/sections";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const response = await createSection(body);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create section",
            },
            { status: 500 }
        );
    }
}
