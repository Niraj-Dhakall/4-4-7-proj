"// /app/api/proposals"
import { NextResponse, NextRequest } from "next/server";
import { createProject } from "../../../../../lib/projects";
import { error } from "console";

export async function POST(req: NextRequest, res:NextResponse){
    if(req.method != "POST"){
        return NextResponse.json({ message: 'wrong method' }, { status: 405 });
    }

    try{
        const body = await req.json();
        console.log(body)
        const response = await createProject(body);
        return NextResponse.json(
            {response: response},
            {status: 200}
        
        );

    }catch(error){
        return NextResponse.json({error: error instanceof Error ? error.message : "Failed to create account"}, {status: 500})
    }

}