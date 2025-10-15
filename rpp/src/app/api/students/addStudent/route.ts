import { NextResponse, NextRequest } from "next/server";
import { addStudent } from "../../../../../lib/students";
export async function POST(req: NextRequest){
    console.log("in post");
    try{
        const body = await req.json();
        const response = await addStudent(body);

        return NextResponse.json(
            {response: response},
            {status: 200}
        
        );

    }catch(error){
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}