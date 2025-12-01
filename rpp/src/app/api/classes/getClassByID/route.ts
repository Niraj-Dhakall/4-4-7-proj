"// /app/api/classes";
import { NextResponse, NextRequest } from "next/server";
import { getClassByID } from "../../../../../lib/classes";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const id = searchParams.get("id");
        if (id) {
            const response = await getClassByID(id);

            if (!response) {
                return NextResponse.json("Class not found", {
                    status: 404,
                });
            }

            return NextResponse.json(response, { status: 200 });
        }
        return NextResponse.json("No ID provided", { status: 404 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
