"// /app/api/sections";
import { NextResponse, NextRequest } from "next/server";
import { delSectionByID } from "../../../../../lib/sections";

export async function DELETE(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "No valid ID" }, { status: 400});
        }

        const deletedSection = await delSectionByID(id);
        
        return NextResponse.json({ deletedSection }, { status: 200 });
    } catch (error) {
        console.log("Failed to delete")
        return NextResponse.json(error, { status: 500 });
    }
}