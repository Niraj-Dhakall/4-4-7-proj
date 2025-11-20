"// /app/api/proposals";
import { NextResponse, NextRequest } from "next/server";
import { createProject } from "../../../../lib/actions";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const response = await createProject(body);
        return NextResponse.json(
            { message: "Proposal Successfully Posted", response },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error posting Proposal", error },
            { status: 500 }
        );
    }
}
