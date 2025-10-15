"// /app/api/stakeholders"
import { NextResponse, NextRequest } from "next/server";
import { getStakeholdersById } from "../../../../../lib/stakeholders";
import { error } from "console";

export async function GET(req: NextRequest, res: NextResponse){
    try{
        const searchParams = req.nextUrl.searchParams;
        let response;
        if(searchParams){
            const id = searchParams.get('id');
            
            if(id){
                response = await getStakeholdersById(id);
            }

        }
        return NextResponse.json(response,{status:200})
    }catch(error){
        console.log("Failed to fetch Proposal Posts!")
        return NextResponse.json(error,{status:500})
    }
}
