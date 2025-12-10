"use client";
import React, { useState } from "react";
import GoBackButton from "./GoBackButton";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorComponent from "./error";
export default function JoinSection() {
    const [formData, setFormData] = useState({
        SectionID: "",
    });
    const { data: session, status } = useSession();
    const router = useRouter();
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
    const [error, setError] = useState({ type: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError({ type: "", message: "" });
    };

    async function handleSubmit() {
        if (!formData.SectionID.trim()) {
            setError({ type: "error", message: "Please enter a Section ID." });
            return;
        }

        try {
            const section = await fetch(
                `/api/sections/getSectionByCode?code=${formData.SectionID}`
            );
            const body = await section.json();
            if (!section.ok) {
                setError(body);
            } else {
                const sectionID = body.id;
                const res = await fetch(`/api/sections/addStudentToSection`, {
                    method: "PATCH",
                    body: JSON.stringify({ studentID, sectionID }),
                });
                const addBody = await res.json();
                if (!res.ok) {
                    setError({ message: addBody, type: "error" });
                } else {
                    setError({
                        type: "Success",
                        message: "Section joined successfully",
                    });
                }
            }
        } catch (error) {
            let message = "Unknown error";
            if (error instanceof Error) {
                message = error.message;
            }
            setError({ type: "error", message: message });
        }
    }

    return (
        <div className="flex flex-col border border-slate-500 bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start">
            {/* Header */}
            <div className="flex justify-center w-full bg-gray-200 p-4">
                <h1 className="text-black font-bold text-xl">
                    Join A CMSC447 Section
                </h1>
            </div>

            {/* Back Button */}
            <div className="flex w-full justify-start">
                <GoBackButton route={"/portal"} />
            </div>

            {/* Form Content */}
            <div className="p-5 w-full">
                {/* Error Message */}
                {error && (
                    <ErrorComponent Message={error.message} Type={error.type} />
                )}

                {/* Input */}
                <div className="flex flex-col">
                    <label htmlFor="SectionID" className="text-black">
                        Section Code
                    </label>
                    <input
                        id="SectionID"
                        name="SectionID"
                        className="text-black border border-slate-300 p-3 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-amber-500 
                        transition-all bg-white"
                        value={formData.SectionID}
                        placeholder="ex: ABCD"
                        onChange={handleChange}
                    />
                </div>

                {/* Submit */}
                <div className="w-full flex justify-end mt-5">
                    <button
                        className="p-2 rounded w-full bg-amber-400 hover:bg-black transition text-white"
                        onClick={handleSubmit}
                    >
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
}
