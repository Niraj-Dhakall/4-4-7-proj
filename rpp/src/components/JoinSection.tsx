"use client";
import React, { useState } from "react";
import GoBackButton from "./GoBackButton";

export default function JoinSection() {
    const [formData, setFormData] = useState({
        SectionID: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); 
    };

    const handleSubmit = () => {
        if (!formData.SectionID.trim()) {
            setError("Please enter a Section ID.");
            return;
        }

        console.log("Joining section:", formData.SectionID);
    };

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
                    <div className="w-full flex p-2 rounded mb-3 bg-red-300">
                        <p className="text-black font-semibold">{error}</p>
                    </div>
                )}

                {/* Input */}
                <div className="flex flex-col">
                    <label htmlFor="SectionID" className="text-black">
                        Section ID
                    </label>
                    <input
                        id="SectionID"
                        name="SectionID"
                        className="text-black border border-slate-300 p-3 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-amber-500 
                        transition-all bg-white"
                        value={formData.SectionID}
                        placeholder="Section ID #"
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
