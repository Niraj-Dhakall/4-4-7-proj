"// /app/api/stakeholders";
import { NextResponse, NextRequest } from "next/server";
import { verifyStakeholderCode } from "../../../../../lib/stakeholders";


export async function POST(req: NextRequest) {
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
