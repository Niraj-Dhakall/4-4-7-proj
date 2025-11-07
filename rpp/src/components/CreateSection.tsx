import React from "react";

export default function CreateSection({
    handleDisplaySection,
}: {
    handleDisplaySection: () => void;
}) {
    return (
        <div className="flex flex-col border border-slate-500  bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start-safe">
            <div className="flex justify-center w-full bg-gray-200 p-4 ">
                <h1 className="text-black font-bold text-xl">
                    Create CMSC447 Section
                </h1>
            </div>
            ;
        </div>
    );
}
