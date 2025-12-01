"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

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

export default function ViewClass() {
    const { data: session, status } = useSession();
    const params = useParams();
    const classID = params.id as string;
    const router = useRouter();
    const [classData, setClassData] = useState<Class>();
    const [loading, setLoading] = useState(true);
    const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
        null
    );

    useEffect(() => {
        if (status === "unauthenticated" || session?.user.userType != "admin") {
            router.push("/login");
            return;
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchClass();
        }
    }, [status, session, router]);

    async function fetchClass() {
        try {
            const res = await fetch(`/api/classes/getClassByID?id=${classID}`, {
                method: "GET",
            });
            const body = await res.json();
            setClassData(body);
        } catch (error) {
            console.error("Error fetching class:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Class not found</p>
            </div>
        );
    }

    return <div>hi</div>;
}
