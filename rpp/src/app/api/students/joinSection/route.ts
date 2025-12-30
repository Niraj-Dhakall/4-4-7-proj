import { NextResponse, NextRequest } from "next/server";
import { joinGroup } from "../../../../../lib/groups";
import { requireRole } from "../../../../../lib/auth";
import joinSection from "@/app/joinsection/page";

export async function POST(req: NextRequest){
    const { error, session } = await requireRole(["admin", "student"])
                                                    
    if (error) {
        return error;
    }

    try{
        const body = await req.json();
        const { sectionID } =  body;
        
        const response = joinSection()
        return NextResponse.json(response, { status: 200 });

    }catch(error){
        console.error("Error joining group:", error);
        return NextResponse.json(
            { message: "Error joining group", error },
            { status: 500 }
        );
    }
}