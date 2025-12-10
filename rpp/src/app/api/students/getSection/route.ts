import { NextResponse, NextRequest } from "next/server";
import { getStudentSection } from "../../../../../lib/students";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const studentID = searchParams.get("id");

    try {
        if (!studentID) {
            return NextResponse.json(
                { type: "error", message: "No student ID provided" },
                { status: 400 }
            );
        }

        const section = await getStudentSection(studentID);

        if (!section) {
            return NextResponse.json(
                { type: "error", message: "You are not enrolled in any section" },
                { status: 404 }
            );
        }

        return NextResponse.json(section, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            { type: "error", message: "Error fetching section" },
            { status: 500 }
        );
    }
}
