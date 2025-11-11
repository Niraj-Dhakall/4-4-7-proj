import { NextResponse, NextRequest } from "next/server";
import { getStudentByEmail } from "../../../../../lib/students";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "Student email is required" },
                { status: 400 }
            );
        }

        const response = await getStudentByEmail(email);

        if (!response) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/students/getStudentByEmail:", error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
