"use client";
import React from "react";
import CreateGroup from "@/components/CreateGroup";
export default function createGroup() {
    return (
        <div className="flex justify-center bg-gradient-to-r from-yellow-400 via-amber-400 h-[100vh] to-yellow-500 items-center">
            <CreateGroup />
        </div>
    );
}
