'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";

interface Major {
    level: string;
    name: string;
    gradYear: string;
}

interface Student {
    id: string;
    email: string;
    name: string;
    major: Major;
    year: string;
    gpa: number;
    skills: string[];
    portfolio?: string | null;
    courses: string[];
    graduation: string;
}

export default function ProfilePage(){
    // const { data: session, status } = useSession()
    const router = useRouter()
    const [student, setStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     // Redirect to login if not authenticated
    //     if (status === "unauthenticated") {
    //         router.push("/login")
    //         return
    //     }

    //     // Fetch student data once session is available
    //     if (status === "authenticated" && session?.user?.id) {
    //         fetchStudentData(session.user.id)
    //     }
    // }, [status, session, router])

    useEffect(() =>{
        router.push("/")
    }, [])
    
    

    return(
        <div className="flex w-full h-full justify-center items-center">
                <h1 className="text-black">hi</h1>
        </div>
    );
}