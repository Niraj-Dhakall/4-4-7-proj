"use client";
import React, { useState } from "react";
import GoBackButton from "./GoBackButton";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorComponent from "./error";

interface Section {
    id: string;
    code: string;
    sec_number: number;
    time: string;
    days: string;
    location: string;
}

export default function LeaveSection() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [confirmClicked, setConfirmClicked] = useState(false);
    const [currentSection, setCurrentSection] = useState<Section | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ type: "", message: "" });

    useEffect(() => {
        if (
            status === "unauthenticated" ||
            session?.user.userType != "student"
        ) {
            router.push("/login");
            return;
        }
    }, [status, session, router]);

    const studentID = session?.user.id;

    useEffect(() => {
        async function fetchCurrentSection() {
            if (!studentID) return;

            try {
                const res = await fetch(`/api/students/getSection?id=${studentID}`);
                if (res.ok) {
                    const section = await res.json();
                    setCurrentSection(section);
                } else {
                    const errorData = await res.json();
                    setError(errorData);
                }
            } catch (error) {
                setError({
                    type: "error",
                    message: "Failed to load your current section",
                });
            } finally {
                setLoading(false);
            }
        }

        if (studentID) {
            fetchCurrentSection();
        }
    }, [studentID]);

    async function handleLeaveClick() {
        if (!currentSection) {
            setError({
                type: "error",
                message: "You are not enrolled in any section",
            });
            return;
        }

        if (!confirmClicked) {
            setConfirmClicked(true);
            // Reset confirmation after 3 seconds
            setTimeout(() => setConfirmClicked(false), 3000);
            return;
        }

        // Second click - proceed with leaving
        if (!studentID) {
            return;
        }

        try {
            const res = await fetch(`/api/sections/remStudent`, {
                method: "PATCH",
                body: JSON.stringify({
                    studentID,
                    sectionID: currentSection.id,
                }),
            });

            if (!res.ok) {
                setError(await res.json());
            } else {
                setError({
                    type: "Success",
                    message: "Section left successfully",
                });
                setCurrentSection(null);
                setConfirmClicked(false);
            }
        } catch (error) {
            let message = "Unknown error";
            if (error instanceof Error) {
                message = error.message;
            }
            setError({ type: "error", message: message });
            setConfirmClicked(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col border border-slate-500 bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start">
                <div className="flex justify-center w-full bg-gray-200 p-4">
                    <h1 className="text-black font-bold text-xl">
                        Leave A CMSC447 Section
                    </h1>
                </div>
                <div className="p-5 w-full text-center">
                    <p className="text-black">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col border border-slate-500 bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start">
                {/* Header */}
                <div className="flex justify-center w-full bg-gray-200 p-4">
                    <h1 className="text-black font-bold text-xl">
                        Leave A CMSC447 Section
                    </h1>
                </div>

                {/* Back Button */}
                <div className="flex w-full justify-start">
                    <GoBackButton route={"/portal"} />
                </div>

                {/* Content */}
                <div className="p-5 w-full">
                    {/* Error/Success Message */}
                    {error.message && (
                        <ErrorComponent Message={error.message} Type={error.type} />
                    )}

                    {currentSection ? (
                        <>
                            {/* Current Section Info */}
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-5">
                                <h2 className="text-lg font-semibold text-black mb-3">
                                    Your Current Section
                                </h2>
                                <div className="space-y-2 text-black">
                                    <p>
                                        <span className="font-medium">Section Number:</span>{" "}
                                        {currentSection.sec_number}
                                    </p>
                                    <p>
                                        <span className="font-medium">Code:</span>{" "}
                                        {currentSection.code}
                                    </p>
                                    <p>
                                        <span className="font-medium">Time:</span>{" "}
                                        {currentSection.time}
                                    </p>
                                    <p>
                                        <span className="font-medium">Days:</span>{" "}
                                        {currentSection.days}
                                    </p>
                                    <p>
                                        <span className="font-medium">Location:</span>{" "}
                                        {currentSection.location}
                                    </p>
                                </div>
                            </div>

                            {/* Leave Button */}
                            <div className="w-full">
                                <button
                                    className={`p-2 rounded w-full transition text-white ${
                                        confirmClicked
                                            ? "bg-red-700 hover:bg-red-800"
                                            : "bg-red-500 hover:bg-red-700"
                                    }`}
                                    onClick={handleLeaveClick}
                                >
                                    {confirmClicked
                                        ? "Click again to confirm"
                                        : "Leave Section"}
                                </button>
                                {confirmClicked && (
                                    <p className="text-sm text-gray-600 mt-2 text-center">
                                        Click the button again to confirm leaving the section
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                You are not currently enrolled in any section.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
