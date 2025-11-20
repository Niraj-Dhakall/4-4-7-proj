"// /app/api/stakeholders";
import { NextResponse, NextRequest } from "next/server";
import { createStakeholder } from "../../../../../lib/stakeholders";


export async function POST(req: NextRequest) {
    
    try {
        const body = await req.json();
        await createStakeholder(body);
        return NextResponse.json(
            { message: "Stakeholder Account Successfully Created"},
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error Creating Account", error },
            { status: 500 }
        );
    }
}
