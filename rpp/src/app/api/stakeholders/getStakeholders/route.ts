"// /app/api/stakeholders"
import { NextResponse, NextRequest } from "next/server";
import { getStakeholdersById } from "../../../../../lib/stakeholders";


export async function GET(req: NextRequest, res: NextResponse){
    try{
        const searchParams = req.nextUrl.searchParams;
        let response;
        if(searchParams){
            const id = searchParams.get('id');
            
            if(id){
                response = await getStakeholdersById(id);
            }

            if (response === -1){
                return NextResponse.json("Stakeholder not found", {status: 404});
            }


        }
        return NextResponse.json(response,{status:200})
    }catch(error){

        return NextResponse.json(error,{status:500})
    }
}
