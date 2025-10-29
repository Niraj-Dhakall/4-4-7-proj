import { NextResponse, NextRequest } from "next/server";
import { addStudent } from "../../../../../lib/students";
export async function POST(req: NextRequest) {
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
