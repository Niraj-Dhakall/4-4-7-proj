"use client";
import React from "react";
import { useState, useEffect } from "react";
export default function JoinGroup() {
    const [formData, setFormData] = useState({
        name: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    async function handleSubmit(){

    }
    return (
        <div className="flex flex-col border border-slate-500  bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start-safe">
            <div className="flex justify-center w-full bg-gray-200 p-4 ">
                <h1 className="text-black font-bold text-xl">
                    Join A CMSC447 Group
                </h1>
            </div>
            <div className="p-6 w-full">
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-black">
                        Group Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        className="text-black border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                        value={formData.name}
                        placeholder="Group Name"
                        onChange={handleChange}
                    ></input>
                </div>
                <div className="w-full flex justify-end mt-3">
                    <button
                        className="p-2 rounded bg-black text-white"
                        onClick={handleSubmit}
                    >
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
}
