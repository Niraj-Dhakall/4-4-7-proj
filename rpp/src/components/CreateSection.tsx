"use client";
import React from "react";
import { useState } from "react";
import ErrorComponent from "./error";
export default function CreateSection({
    handleDisplaySection,
    classId,
    onSectionCreated,
}: {
    handleDisplaySection: () => void;
    classId: string;
    onSectionCreated: (sectionNumber: string) => void;
}) {
    const [formData, setFormData] = useState({
        number: "",
        time: "",
        days: "",
        location: "",
    });
    const [error, setError] = useState({
        type: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.number || !formData.time || !formData.location) {
            setError({
                type: "error",
                message: "Please fill in all fields",
            });
            return;
        }

        setIsLoading(true);
        setError({ type: "", message: "" });

        try {
            const res = await fetch("/api/sections/createSection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sec_number: parseInt(formData.number),
                    time: formData.time,
                    days: formData.days,
                    location: formData.location,
                    class_id: classId,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError({
                    type: "error",
                    message: errorData.error || "Failed to create section",
                });
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            onSectionCreated(`Section ${formData.number}`);
        } catch (err) {
            setError({
                type: "error",
                message: "Failed to create section",
            });
            setIsLoading(false);
        }
    }
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col border border-slate-200  bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start-safe">
            <div className="p-2">
                <ErrorComponent Type={error.type} Message={error.message} />
            </div>
            <div className="flex justify-center w-full bg-gray-200 p-4 ">
                <h1 className="text-black font-bold text-xl">
                    Create A CMSC447 Section
                </h1>
            </div>
            <div className="p-6 w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section Number */}
                        <div className="flex flex-col space-y-2">
                            <label
                                htmlFor="number"
                                className="text-slate-700 font-medium text-sm"
                            >
                                Section Number
                            </label>
                            <input
                                id="number"
                                type="text"
                                className="border border-slate-300 rounded-md text-black p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholder="ex. 1,4"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Section Time */}
                        <div className="flex flex-col space-y-2">
                            <label
                                htmlFor="time"
                                className="text-slate-700 font-medium text-sm"
                            >
                                Section Time
                            </label>
                            <input
                                id="time"
                                type="text"
                                className="border border-slate-300 rounded-md text-black p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholder="ex. 4pm-5:15pm"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Section Days */}
                        <div className="flex flex-col space-y-2">
                            <label
                                htmlFor="days"
                                className="text-slate-700 font-medium text-sm"
                            >
                                Section Days
                            </label>
                            <select
                                id="days"
                                name="days"
                                className="text-black border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                                value={formData.days}
                                onChange={handleChange}
                            >
                                <option value="M/W">M/W</option>
                                <option value="Tu/Th">Tu/Th</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col space-y-2">
                            <label
                                htmlFor="location"
                                className="text-slate-700 font-medium text-sm"
                            >
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                className="border border-slate-300 rounded-md text-black p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholder="ex. ITE 123"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleDisplaySection}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer text-slate-700 font-semibold py-3 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1  bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:cursor-pointer text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating..." : "Create Section"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
