"// /app/api/proposals"
import { NextResponse, NextRequest } from "next/server";
import { getApplicatantsInProjectByID } from "../../../../../lib/projects";

export async function GET(req: NextRequest){
    try{
        const searchParams = req.nextUrl.searchParams;
        let response;
        if(searchParams){
            const id = searchParams.get('id');
            if(id){
                response = await getApplicatantsInProjectByID({projID: id});
            }
        }
        return NextResponse.json(response,{status:200})
    }catch(error){
        return NextResponse.json(error,{status:500})
    }
}

