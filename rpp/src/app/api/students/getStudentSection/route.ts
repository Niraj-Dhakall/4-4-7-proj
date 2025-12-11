import { NextResponse, NextRequest } from "next/server";
import { getStudentSection } from "../../../../../lib/students";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Student ID is required" },
                { status: 400 }
            );
        }

        const section = await getStudentSection(id);
        return NextResponse.json(section, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch student section",
            },
            { status: 500 }
        );
    }
}
