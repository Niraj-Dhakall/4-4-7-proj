import { getGroupByName } from "../../../../../lib/groups";
import { NextResponse, NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const name = req.nextUrl.searchParams.get("name");

        if (!name) {
            return NextResponse.json(
                { message: "Group name is required" },
                { status: 400 }
            );
        }

        const group = await getGroupByName({ name });

        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(group, { status: 200 });
    } catch (error) {
        console.error("Error getting group:", error);
        return NextResponse.json(
            { message: "Error getting group", error },
            { status: 500 }
        );
    }
}
