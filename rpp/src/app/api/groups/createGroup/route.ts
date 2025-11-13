import { NextResponse, NextRequest } from "next/server";
import { createGroup } from "../../../../../lib/groups";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, group_master_id, section_id } = body;

        if (!name || !group_master_id || !section_id) {
            return NextResponse.json(
                { message: "Name and group_master_id and section_id are required" },
                { status: 400 }
            );
        }

        const result = await createGroup({ name, group_master_id, section_id });

        if (!result.success) {
            return NextResponse.json(
                { message: result.message, error: result.error },
                { status: 409 } 
            );
        }

        return NextResponse.json(result.data, { status: 201 });
    } catch (error) {
        console.error("Error creating group:", error);
        return NextResponse.json(
            { message: "Error creating group", error },
            { status: 500 }
        );
    }
}