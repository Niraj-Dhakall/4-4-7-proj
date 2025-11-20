import { NextResponse, NextRequest } from "next/server";
import { joinGroup } from "../../../../../lib/groups";

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const {studentID, groupID} =  body;
        const response = await joinGroup({studentID, groupID});
        if ("success" in response && !response.success) {
            return NextResponse.json(
                { message: response.message, error: response.error },
                { status: 409 } 
            );
        }
        return NextResponse.json(response, { status: 200 });

    }catch(error){
        console.error("Error joining group:", error);
        return NextResponse.json(
            { message: "Error joining group", error },
            { status: 500 }
        );
    }
}