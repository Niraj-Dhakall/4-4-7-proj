"// /app/api/stakeholders";
import { NextResponse, NextRequest } from "next/server";
import { createStakeholder } from "../../../../../lib/stakeholders";
import { requireRole } from "../../../../../lib/auth";

export async function POST(req: NextRequest) {
    const { error, session } = await requireRole(["admin", "stakeholder"])
                                
    if (error) {
        return error;
    }

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
