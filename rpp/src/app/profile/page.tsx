"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (session?.user.userType == "stakeholder") {
            router.push("/profile/stakeholder");
            return;
        } else if (session?.user.userType == "student") {
            router.push("/profile/student");
        }else if( session?.user.userType == 'admin'){
            router.push("/profile/admin")
        }else {
            router.push("/login");
        }
    }, [status, session, router]);

    return (
        <div className="flex w-full h-full justify-center items-center">
            <h1 className="text-black">hi</h1>
        </div>
    );
}
