"// /app/api/stakeholders";
import { NextResponse, NextRequest } from "next/server";
import { verifyStakeholderCode } from "../../../../../lib/stakeholders";
import { requireRole } from "../../../../../lib/auth";

export async function POST(req: NextRequest) {
    const { error, session } = await requireRole(["admin", "stakeholder"])
                                    
    if (error) {
        return error;
    }

    try {
        const body = await req.json();
        const response = await verifyStakeholderCode(body);
        if (response.success) {
            return NextResponse.json(
                { message: "Code Verified" },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Error Verifying code", error },
            { status: 500 }
        );
    }
}
