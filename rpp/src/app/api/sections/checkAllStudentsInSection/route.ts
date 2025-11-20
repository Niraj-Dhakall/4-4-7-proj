"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { checkAllStudentsInSection } from "../../../../../lib/sections";


export async function GET(req: NextRequest){
    try{
        const searchParams = req.nextUrl.searchParams;
        let response;
        if(searchParams){
            const id = searchParams.get('sectionID');
            
            if(id){
                response = await checkAllStudentsInSection(id);
            }
        }
        return NextResponse.json(response,{status:200})
    }catch(error){
        return NextResponse.json(error,{status:500})
    }
}