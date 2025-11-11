"// /app/api/classes";
import { NextResponse, NextRequest } from "next/server";
import { getClass } from "../../../../../lib/classes";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        let response;

        response = await getClass();

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
