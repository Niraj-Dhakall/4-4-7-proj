"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ErrorComponent from "@/components/error";
interface Student {
    id: string;
    email: string;
    name: string;
    major: string[];
    year: string;
    gpa: number;
    skills: string[];
    courses: string[];
    graduation: string;
    applications: string[];
    accepted: string[];
    portfolio: string | null;
}

interface Group {
    id: string;
    name: string;
    member_count: number;
    members: string[];
    group_master: {
        id: string;
        name: string;
        email: string;
    };
}
interface Class {
    id: string;
    name: string;
    semester: string;
    sections: Section[];
}

interface Section {
    id: string;
    sec_number: number;
    time: string;
    days: string;
    location: string;
    projects: string[];
    students: string[];
    groups: string[];
    student_count: number;
    group_count: number;
    class_id: string;
}

export default function ViewClass() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState<Section>();
    const [error, setError] = useState({
        type: "", message: ""
    })
    const searchParams = useSearchParams();
    const sectionID = searchParams.get("sectionID");

    useEffect(() => {
        if (status === "unauthenticated" || session?.user.userType != "admin") {
            router.push("/login");
            return;
        }
    }, [status, session, router]);

    useEffect(() => {
        if (!sectionID) {
            return;
        } else {
            fetchSection();
        }

    }, [sectionID])
    async function fetchSection() {
        try {
            const res = await fetch(`/api/sections/getSection?id=${sectionID}`, {
                method: "GET"
            })
            const body = await res.json()
            setSection(body);
            setLoading(false);
        } catch (error) {
            setError({ type: "error", message: "unknown error getting section" })
        }
    }

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!section) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Section not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-400">
            <HeaderWithSidebar />
            <div className="flex flex-col items-center">
                {/* name and other info */}
                <div className="flex flex-col border border-slate-500  bg-white rounded w-full justify-center mt-10 max-w-7xl md:max-w-5xl items-center">
                    <ErrorComponent Message={error.message} Type={error.type} />
                    <div className="flex flex-col justify-center items-center w-full bg-gray-200 p-5 ">
                        <p className="text-md text-black font-semibold">View Details about the section</p>
                        <p className="text-md text-slate-500 font-semibold">Section: {section.sec_number} - {section.days} {section.time}</p>
                    </div>

                </div>
                {/* students */}
                <div>

                </div>

                {/* groups */}
            </div>
        </div>
    );
}
