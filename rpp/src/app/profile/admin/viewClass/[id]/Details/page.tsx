"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import GoBackButton from "@/components/GoBackButton";
import {
    ChevronDown,
    ChevronUp,
    Users,
    BookOpen,
    FolderKanban,
} from "lucide-react";

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

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    status: string;
    friendly: boolean;
    project_manager_id: string;
    date: string;
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
    code: string;
}

export default function SectionDetails() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const classID = params.id as string;
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState<Section>();
    const [students, setStudents] = useState<Student[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    const [expandedStudents, setExpandedStudents] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState(false);

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
            fetchSectionData();
        }
    }, [sectionID]);

    async function fetchSectionData() {
        try {
            const sectionRes = await fetch(
                `/api/sections/getSection?id=${sectionID}`,
                {
                    method: "GET",
                }
            );
            const sectionBody = await sectionRes.json();
            setSection(sectionBody);

            const studentsRes = await fetch(
                `/api/sections/checkAllStudentsInSection?sectionID=${sectionID}`,
                {
                    method: "GET",
                }
            );
            const studentsBody = await studentsRes.json();
            // console.log("Students fetched:", studentsBody);
            setStudents(studentsBody || []);

            const groupsRes = await fetch(
                `/api/sections/checkAllGroupsInSection?sectionID=${sectionID}`,
                {
                    method: "GET",
                }
            );
            const groupsBody = await groupsRes.json();
            // console.log("Groups fetched:", groupsBody);
            setGroups(groupsBody || []);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching section data:", error);
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
                <div className="flex flex-col border border-slate-500 bg-white rounded w-full justify-center mt-10 max-w-7xl md:max-w-5xl">
                    {/* Header */}
                    <div className="flex justify-between items-center w-full bg-gray-300 p-5">
                        <GoBackButton
                            route={`/profile/admin/viewClass/${classID}`}
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="font-bold text-2xl text-black">
                                Section {section.sec_number}
                            </h1>
                            <p className="text-sm text-slate-600">
                                {section.days} • {section.time}
                            </p>
                        </div>
                        <div className="w-20"></div>
                    </div>

                    <div className="max-w-7xl md:max-w-5xl border border-slate-400" />

                    {/* Section Overview */}
                    <div className="flex flex-col w-full justify-start p-3">
                        <h1 className="font-semibold text-md text-slate-500 mb-2">
                            Section Overview
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded p-3">
                            <div className="w-full">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-white border border-slate-300 p-3 rounded">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Location
                                        </p>
                                        <p className="font-semibold text-black">
                                            {section.location}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-slate-300 p-3 rounded">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Time
                                        </p>
                                        <p className="font-semibold text-black">
                                            {section.time}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-slate-300 p-3 rounded">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Days
                                        </p>
                                        <p className="font-semibold text-black">
                                            {section.days}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-slate-300 p-3 rounded">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Section Number
                                        </p>
                                        <p className="font-semibold text-black">
                                            {section.sec_number}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students Section */}
                    <div className="flex flex-col w-full justify-start p-3">
                        <h1 className="font-semibold text-md text-slate-500">
                            Students
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            <div className="w-full">
                                <div
                                    onClick={() =>
                                        setExpandedStudents(!expandedStudents)
                                    }
                                    className="bg-white border border-slate-300 p-4 rounded hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-slate-600" />
                                            <div>
                                                <h2 className="font-bold text-lg text-black">
                                                    Student List
                                                </h2>
                                                <p className="text-sm text-slate-600">
                                                    {section.student_count}{" "}
                                                    student(s) enrolled
                                                </p>
                                            </div>
                                        </div>
                                        {expandedStudents ? (
                                            <ChevronUp className="w-5 h-5 text-slate-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-600" />
                                        )}
                                    </div>

                                    {expandedStudents && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            {students.length === 0 ? (
                                                <p className="text-sm text-slate-500 text-center">
                                                    No students enrolled
                                                </p>
                                            ) : (
                                                <div className="grid gap-2">
                                                    {students.map((student) => (
                                                        <div
                                                            key={
                                                                student.id +
                                                                student.name
                                                            }
                                                            className="bg-slate-50 p-3 rounded border border-slate-200"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="font-semibold text-black">
                                                                        {
                                                                            student.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-slate-600">
                                                                        {
                                                                            student.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-right text-xs text-slate-500">
                                                                    <p>
                                                                        Year:
                                                                        {
                                                                            student.year
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        GPA:
                                                                        {
                                                                            student.gpa
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Groups Section */}
                    <div className="flex flex-col w-full justify-start p-3">
                        <h1 className="font-semibold text-md text-slate-500">
                            Groups
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            <div className="w-full">
                                <div
                                    onClick={() =>
                                        setExpandedGroups(!expandedGroups)
                                    }
                                    className="bg-white border border-slate-300 p-4 rounded hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-5 h-5 text-slate-600" />
                                            <div>
                                                <h2 className="font-bold text-lg text-black">
                                                    Group List
                                                </h2>
                                                <p className="text-sm text-slate-600">
                                                    {section.group_count}{" "}
                                                    group(s) in section
                                                </p>
                                            </div>
                                        </div>
                                        {expandedGroups ? (
                                            <ChevronUp className="w-5 h-5 text-slate-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-600" />
                                        )}
                                    </div>

                                    {expandedGroups && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            {groups.length === 0 ? (
                                                <p className="text-sm text-slate-500 text-center">
                                                    No groups created
                                                </p>
                                            ) : (
                                                <div className="grid gap-2">
                                                    {groups.map((group) => (
                                                        <div
                                                            key={group.id}
                                                            className="bg-slate-50 p-3 rounded border border-slate-200"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="font-semibold text-black">
                                                                        {
                                                                            group.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-slate-600">
                                                                        Leader:
                                                                        {
                                                                            group
                                                                                .group_master.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                                                                        {
                                                                            group.member_count
                                                                        }
                                                                        members
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
