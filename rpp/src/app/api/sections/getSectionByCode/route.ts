"// /app/api/sections";
import { NextResponse, NextRequest } from "next/server";
import { getSectionByCode } from "../../../../../lib/sections";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        let response;
        if (searchParams) {
            const code = searchParams.get("code");

            if (code) {
                response = await getSectionByCode(code);
                if (!response) {
                    return NextResponse.json("No section found", {
                        status: 404,
                    });
                }
            } else {
                return NextResponse.json("No code provided", { status: 404 });
            }
        }
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
