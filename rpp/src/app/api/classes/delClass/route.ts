"// /app/api/classes";
import { NextResponse, NextRequest } from "next/server";
import { delClassByID } from "../../../../../lib/classes";

export async function DELETE(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "No valid ID" }, { status: 400});
        }

        const deletedClass = await delClassByID(id);
        
        return NextResponse.json({ deletedClass }, { status: 200 });
    } catch (error) {
        console.log("Failed to delete")
        return NextResponse.json(error, { status: 500 });
    }
}