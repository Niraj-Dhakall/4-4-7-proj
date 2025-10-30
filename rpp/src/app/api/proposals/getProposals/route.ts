"// /app/api/proposals"
import { NextResponse, NextRequest } from "next/server";
import { getProjects, getProjectsById, getProjectsByName } from "../../../../../lib/projects";
import { error } from "console";

export async function GET(req: NextRequest, res: NextResponse){
    try{
        const searchParams = req.nextUrl.searchParams;
        let response;
        if(searchParams){
            const id = searchParams.get('id');
            const name = searchParams.get('name')
            
            if(id){
                response = await getProjectsById(id);
            }else if (name){
                response = await getProjectsByName(name);
            }else{
                response = await getProjects();
            }

        }
        return NextResponse.json(response,{status:200})
    }catch(error){
        return NextResponse.json(error,{status:500})
    }
}

