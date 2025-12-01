import { getAllStudentsInGroup } from "../../../../../lib/groups";
import { NextResponse, NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const groupID = req.nextUrl.searchParams.get("id");

        if (!groupID) {
            return NextResponse.json(
                { message: "Group ID is required" },
                { status: 400 }
            );
        }

        const students = await getAllStudentsInGroup({ groupID });

        if (!students) {
            return NextResponse.json(
                { message: "Could not get students in group" },
                { status: 404 }
            );
        }

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error("Error getting group:", error);
        return NextResponse.json(
            { message: "Error getting group", error },
            { status: 500 }
        );
    }
}
