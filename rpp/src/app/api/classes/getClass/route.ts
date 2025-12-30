"// /app/api/classes";
import { NextResponse } from "next/server";
import { getClass } from "../../../../../lib/classes";
import { requireRole } from "../../../../../lib/auth";


export async function GET() {
    const { error, session } = await requireRole(["admin", "student"])
        
    if (error) {
        return error;
    }

    try {
        const response = await getClass();

        if (!response) {
            return NextResponse.json("Class not found", {
                status: 404,
            });
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
