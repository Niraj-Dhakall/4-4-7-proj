"// /app/api/classes";
import { NextResponse, NextRequest } from "next/server";
import { createClass } from "../../../../../lib/classes";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("POST CALLED CREATE")
    try {
        const body = await req.json();
        console.log(body);
        const response = await createClass(body);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create class",
            },
            { status: 500 }
        );
    }
}