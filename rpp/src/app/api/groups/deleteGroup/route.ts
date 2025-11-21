import { NextResponse, NextRequest } from "next/server";
import { deleteGroup } from "../../../../../lib/groups";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: "id" }, { status: 400 });
        }

        const result = await deleteGroup({ id });

        if (result.success) {
            return NextResponse.json(
                { message: result.message },
                { status: 200 }
            );
        } else {
            return NextResponse.json(result.message, { status: 500 });
        }
    } catch (error) {
        console.error("Error deleting group:", error);
        return NextResponse.json(
            { message: "Error deleting group", error },
            { status: 500 }
        );
    }
}
