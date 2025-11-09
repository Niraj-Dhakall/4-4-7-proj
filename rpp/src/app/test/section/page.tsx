'use client'
import React from "react";
import CreateSection from "@/components/CreateSection";
export default function section() {
    function sectionDisplay() {
        // Your function logic here
    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
            <CreateSection handleDisplaySection={sectionDisplay} />
        </div>
    );
}
