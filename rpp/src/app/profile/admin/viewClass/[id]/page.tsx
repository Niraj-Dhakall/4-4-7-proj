"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import GoBackButton from "@/components/GoBackButton";

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

interface Class {
    id: string;
    name: string;
    semester: string;
    sections: Section[];
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

    return (
        <div className="min-h-screen bg-amber-400">
            <HeaderWithSidebar />
            <div className="flex flex-col items-center">
                <div className="flex flex-col border border-slate-500 bg-white rounded w-full justify-center mt-10 max-w-7xl md:max-w-5xl">
                    {/* Header */}
                    <div className="flex justify-between items-center w-full bg-gray-300 p-5">
                        <GoBackButton route="/profile/admin" />
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-2xl text-black">
                                {classData.name}
                            </h1>
                            <h3 className="font-bold text-xl text-slate-500">
                                {classData.semester}
                            </h3>
                        </div>
                        <div className="w-20"></div>
                    </div>

                    <div className="max-w-7xl md:max-w-5xl border border-slate-400" />

                    {/* Sections */}
                    <div className="flex flex-col w-full justify-start p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="font-semibold text-lg text-slate-500">
                                Sections
                            </h1>
                            <span className="text-sm text-slate-500">
                                {classData.sections?.length || 0} section(s)
                            </span>
                        </div>

                        <div className="flex flex-col w-full bg-gray-200 rounded p-5">
                            <div className="w-full space-y-3">
                                {!classData.sections ||
                                    classData.sections.length === 0 ? (
                                    <p className="font-semibold text-md text-slate-500 ml-5">
                                        No sections added yet
                                    </p>
                                ) : (
                                    classData.sections.map((section) => (
                                        <div
                                            key={section.id}
                                            className="w-full"
                                        >
                                            {/* Section Card - Clickable */}
                                            <div
                                                onClick={() =>
                                                    setExpandedSectionId(
                                                        expandedSectionId ===
                                                            section.id
                                                            ? null
                                                            : section.id
                                                    )
                                                }
                                                className="bg-white border border-slate-300 p-4 rounded hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h2 className="font-bold text-lg text-black">
                                                            Section
                                                            {section.sec_number}
                                                        </h2>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {section.time} •
                                                            {section.days}
                                                        </p>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            {section.location}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500">
                                                                Students
                                                            </p>
                                                            <p className="text-lg font-bold text-black">
                                                                {
                                                                    section.student_count
                                                                }
                                                            </p>
                                                        </div>
                                                        {expandedSectionId ===
                                                            section.id ? (
                                                            <ChevronUp className="w-5 h-5 text-slate-600" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-slate-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Expanded Section Details */}
                                            {expandedSectionId ===
                                                section.id && (
                                                    <div className="mt-4 pt-4 border-t bg-slate-50 p-2 border-slate-200">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            <div className="bg-slate-200 p-3 rounded">
                                                                <p className="text-xs text-slate-500 mb-1">
                                                                    Location
                                                                </p>
                                                                <p className="font-semibold text-black">
                                                                    {
                                                                        section.location
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="bg-slate-200 p-3 rounded">
                                                                <p className="text-xs text-slate-500 mb-1">
                                                                    Students
                                                                </p>
                                                                <p className="font-semibold text-black">
                                                                    {
                                                                        section.student_count
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="bg-slate-200 p-3 rounded">
                                                                <p className="text-xs text-slate-500 mb-1">
                                                                    Groups
                                                                </p>
                                                                <p className="font-semibold text-black">
                                                                    {
                                                                        section.group_count
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="bg-slate-200 p-3 rounded">
                                                                <p className="text-xs text-slate-500 mb-1">
                                                                    Time
                                                                </p>
                                                                <p className="font-semibold text-black">
                                                                    {section.time}
                                                                </p>
                                                            </div>
                                                            <div className="bg-slate-200 p-3 rounded">
                                                                <p className="text-xs text-slate-500 mb-1">
                                                                    Days
                                                                </p>
                                                                <p className="font-semibold text-black">
                                                                    {section.days}
                                                                </p>
                                                            </div>
                                                            <div className=" p-4 bg-slate-200 rounded flex justify-center">
                                                                <button
                                                                    className="bg-black p-2 max-w-md hover:cursor-pointer hover:shadow-md"
                                                                    onClick={() =>
                                                                        router.push(
                                                                            `/profile/admin/viewClass/${classID}/Details?sectionID=${section.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    <p className="text-white font-semibold">
                                                                        View
                                                                        Students and
                                                                        Groups
                                                                    </p>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
