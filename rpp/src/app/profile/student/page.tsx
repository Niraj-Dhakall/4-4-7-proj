"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
import { ChevronRightSquare, Circle } from "lucide-react";

interface Major {
    level: string;
    name: string;
    gradYear: string;
}

interface Student {
    id: string;
    email: string;
    name: string;
    major: Major[];
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
    // TODO: add usertype check
    const fetchStudentData = async (studentId: string) => {
        try {
            const response = await fetch(
                `/api/students/getStudentByID?id=${studentId}`
            );
            if (response.ok) {
                const data = await response.json();
                setStudent(data);
                console.log("STUDENT", student);
            } else {
                console.error("Failed to fetch student data");
            }
        } catch (error) {
            console.error("Error fetching student:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchStudentData(session.user.id);
        }
    }, [status, session, router, fetchStudentData]);

    function translateDegree(level: string): string {
        const degrees: Record<string, string> = {
            "Bachelor's": "B.S",
            "Master's": "M.S",
            Phd: "PHD",
        };

        const degree = degrees[level];
        console.log(degree);
        return degree;
    }

    const getColorFromName = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ["bg-red-500/90", "bg-pink-500/90", "bg-rose-500/90"];

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };
    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Student not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-400">
            <HeaderWithSidebar />
            <div className="flex flex-col items-center">
                {/* name and other info */}
                <div className="flex flex-col border border-slate-500  bg-white w-full justify-center mt-10 max-w-7xl md:max-w-5xl items-start-safe">
                    <div className="flex justify-start w-full bg-gray-200 p-5 ">
                        <div className="rounded-full border-black border-2 flex justify-center items-center ">
                            <ProfileImage name={student.name} size={100} />
                        </div>
                        <div className="flex flex-col items-baseline">
                            <div className=" ml-5 mt-2">
                                <h1 className="font-bold text-xl text-black">
                                    {student.name}
                                </h1>
                            </div>
                            <div className="mt-5">
                                <h1 className="text-sm text-slate-500">

                                    Email:
                                    <span className="text-black font-semibold">

                                        {student.email}
                                    </span>
                                </h1>
                                <h1 className="text-sm text-slate-500">

                                    GPA:
                                    <span className="text-black font-semibold">

                                        {student.gpa}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    {/* degree stuff */}
                    <div className="max-w-7xl md:max-w-5xl border border-slate-400" />
                    <div className="flex flex-col w-full justify-start p-5 ">
                        <h1 className="font-semibold text-md text-slate-500">
                            Degree
                        </h1>
                        <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                            {student.major.length === 0 ? (
                                <p className="text-slate-400">
                                    No major listed
                                </p>
                            ) : (
                                student.major.map((major, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-baseline-center mb-3"
                                    >
                                        <div className="flex gap-2">
                                            <div
                                                className={`${getColorFromName(major.name)} w-15 h-10 justify-center items-center flex`}
                                            >
                                                <h2 className="font-bold text-md text-black">
                                                    {translateDegree(
                                                        major.level
                                                    )}
                                                </h2>
                                            </div>
                                            <div className="flex flex-col">
                                                <h1 className="font-bold text-md text-slate-500">
                                                    {major.name}
                                                </h1>
                                                <h1 className="font-bold text-xs text-slate-600">
                                                    Graduation: {major.gradYear}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* portfolio */}
                        <div>
                            <h1 className="font-semibold text-md text-slate-500 mt-5">
                                Portfolio
                            </h1>
                            <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                                {!student.portfolio ? (
                                    <div>
                                        <h1 className="text-slate-400">
                                            {" "}
                                            No portfolio listed
                                        </h1>
                                    </div>
                                ) : (
                                    <div className="flex items-baseline-start gap-2">
                                        <ChevronRightSquare className="text-black" />{" "}
                                        <a href={student.portfolio}>
                                            <span className="text-black text-md font-semibold">
                                                {student.portfolio}
                                            </span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* skills */}
                        <div>
                            <h1 className="font-semibold text-md text-slate-500 mt-5">
                                Skills
                            </h1>
                            <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                                {student.skills.length === 0 ? (
                                    <p className="text-slate-400">
                                        No skills listed
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap">
                                        {student.skills.map((skill, index) => (
                                            <div
                                                className="gap-2 "
                                                key={skill + index}
                                            >
                                                <div
                                                    className="flex gap-2  items-baseline text-black"
                                                    key={skill + index}
                                                >
                                                    <Circle className="text-black w-[10px] h-[10px]" />{" "}
                                                    {skill}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
