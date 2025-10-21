import { NextResponse, NextRequest } from "next/server";
import { getStudentByID } from "../../../../../lib/students";

export async function GET(req: NextRequest){
    try{
        const searchParams = req.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Student ID is required" },
                { status: 400 }
            );
        }

        const response = await getStudentByID(id);

        if (!response) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(response, { status: 200 });
    }catch(error){
        console.error("Error in GET /api/students/getStudentByID:", error);
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}