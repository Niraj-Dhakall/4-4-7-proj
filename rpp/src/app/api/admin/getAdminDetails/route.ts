import { getAdminDetails } from "../../../../../lib/admin";
import { NextResponse, NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "admin ID is required" },
                { status: 400 }
            );
        }

        const admin = await getAdminDetails({ id });

        if (!admin) {
            return NextResponse.json(
                { message: "Could not get admin details" },
                { status: 404 }
            );
        }

        return NextResponse.json(admin, { status: 200 });
    } catch (error) {
        console.error("Error getting admin:", error);
        return NextResponse.json(
            { message: "Error getting admin", error },
            { status: 500 }
        );
    }
}
