"// /app/api/stakeholders";
import { NextResponse, NextRequest } from "next/server";
import { createStakeholder } from "../../../../../lib/stakeholders";
import { error } from "console";

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method != "POST") {
        return NextResponse.json({ message: "wrong method" }, { status: 405 });
    }

    try {
        const body = await req.json();
        console.log(body);
        const response = await createStakeholder(body);
        return NextResponse.json(
            { message: "Stakeholder Account Successfully Created" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error Creating Account", error },
            { status: 500 }
        );
    }
}
