"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

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
    portfolio: string[] | null;
}

export default function StakeholderProjectApplictant() {
    const { data: session, status } = useSession();
    const allowed = ["stakeholder"];
    const router = useRouter();
    const userType = session?.user.userType;
    const params = useParams();
    const id = params.id;
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || !allowed.includes(userType || "")) {
            router.push("/portal");
            return;
        }
        fetchApplicants();
    }, [session, status, userType]);

    async function fetchApplicants() {
        try {
            const res = await fetch(
                `/api/proposals/getStudentApplicationsInProject?id=${id}`,
                { method: "GET" }
            );
            const studentIds = await res.json();

            // Fetch student details for each applicant
            if (studentIds && studentIds.length > 0) {
                await fetchStudentDetails(studentIds);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error loading applicants:", error);
            setLoading(false);
        }
    }

    async function fetchStudentDetails(studentIds: string[]) {
        try {
            const studentPromises = studentIds.map(async (studentId) => {
                const res = await fetch(
                    `/api/students/getStudentByID?id=${studentId}`,
                    { method: "GET" }
                );
                if (res.ok) {
                    return await res.json();
                }
                return null;
            });

            const studentData = await Promise.all(studentPromises);
            setStudents(studentData.filter((student) => student !== null));
        } catch (error) {
            console.error("Error fetching student details:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-400 flex justify-center gap-2 items-center">
                <div className="text-xl font-semibold">
                    Loading applicants...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-400">
            <div className="flex flex-col items-center">
                <div className="flex flex-col border border-slate-500 bg-white rounded w-full justify-center mt-10 max-w-7xl md:max-w-5xl">
                    {/* Header */}
                    <div className="flex justify-between items-center w-full bg-gray-300 p-5">
                        <div className="w-20"></div>
                        <h1 className="font-bold text-2xl text-black">
                            Project Applicants
                        </h1>
                        <div className="w-20"></div>
                    </div>

                    <div className="max-w-7xl md:max-w-5xl border border-slate-400" />

                    {/* Content */}
                    <div className="p-6">
                        {students.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-xl text-gray-600">
                                    No applicants yet for this project.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        className="border border-slate-400 rounded p-6 hover:shadow-lg transition-shadow bg-gray-50"
                                    >
                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {student.name}
                                            </h2>
                                            <p className="text-gray-600">
                                                {student.email}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-700">
                                                    Major:
                                                </h3>
                                                <p className="text-gray-600">
                                                    {student.major.join(", ") ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-700">
                                                        Year:
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {student.year}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-700">
                                                        GPA:
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {student.gpa.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-700">
                                                    Graduation:
                                                </h3>
                                                <p className="text-gray-600">
                                                    {student.graduation}
                                                </p>
                                            </div>

                                            {student.skills.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-700">
                                                        Skills:
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {student.skills.map(
                                                            (skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {student.courses.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-700">
                                                        Courses:
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {student.courses.map(
                                                            (course, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                                                >
                                                                    {course}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {student.portfolio &&
                                                student.portfolio.length >
                                                0 && (
                                                    <div>
                                                        <h3 className="font-semibold text-gray-700">
                                                            Portfolio:
                                                        </h3>
                                                        <a
                                                            href={
                                                                student
                                                                    .portfolio[0]
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm break-all"
                                                        >
                                                            {
                                                                student
                                                                    .portfolio[0]
                                                            }
                                                        </a>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
