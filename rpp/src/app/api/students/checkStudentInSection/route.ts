import { NextResponse, NextRequest } from "next/server";
import { inSection } from "../../../../../lib/students";
import { requireRole } from "../../../../../lib/auth";

export async function GET(req: NextRequest) {
    const { error, session } = await requireRole(["admin", "student"])
                                        
    if (error) {
        return error;
    }

    const searchParams = req.nextUrl.searchParams;
    const studentID = searchParams.get("id");
    
    try {
        if (studentID) {
            const section = await inSection(studentID);
            return NextResponse.json(section, { status: 200 });
        } else {
            return NextResponse.json("No student ID", { status: 500 });
        }
    } catch (e) {
        return NextResponse.json(e, { status: 500 });
    }
}
