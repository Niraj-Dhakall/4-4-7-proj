"// /app/api/sections"
import { NextResponse, NextRequest } from "next/server";
import { checkStudentInSection } from "../../../../../lib/sections";
import { requireRole } from "../../../../../lib/auth";

export async function GET(req: NextRequest){
    const { error, session } = await requireRole(["admin", "student"])
                                        
    if (error) {
        return error;
    }

    try{
        const searchParams = req.nextUrl.searchParams;
        let response;
        if(searchParams){
            const studentID = searchParams.get('studentID');
            const sectionID = searchParams.get('sectionID')
            
            if(studentID && sectionID){
                response = await checkStudentInSection(studentID, sectionID);
            }

        }
        return NextResponse.json(response,{status:200})
    }catch(error){
        return NextResponse.json(error,{status:500})
    }
} 