import { NextResponse, NextRequest } from "next/server";
import { joinGroup } from "../../../../../lib/groups";

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const {sectionID} =  body;
        
        const response = 
        return NextResponse.json(response, { status: 200 });

    }catch(error){
        console.error("Error joining group:", error);
        return NextResponse.json(
            { message: "Error joining group", error },
            { status: 500 }
        );
    }
}