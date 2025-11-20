"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import{useRef} from "react";
const TAG_OPTIONS = [
    "Frontend",
    "Backend",
    "Research",
    "UI/UX",
    "Data",
    "Security",
];
const MAJOR_OPTIONS = [
    "Computer Science",
    "Computer Engineering",
    "Information Systems",
];

const EXPERIENCE_OPTIONS = [
    "Beginner Friendly",
    
]

export default function Email() {
    
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        title: "",
        project_manager_id: "",
        summary_description:"",
        description: "",
        video_link: "",
        video_upload: null as File | null,
        tags: [] as string[],

        date_posted: "",
        status: "Ongoing",
    });

    const divRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    if (divRef.current) {
      const textToCopy = divRef.current.innerText; 
      try {
        await navigator.clipboard.writeText(textToCopy);
        alert("Text copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text");
      }
    }
  };
    
    


        

    return (
        <div className="bg-amber-400 flex justify-center h-[100vh] py-10">
            <div className="bg-white shadow-md w-full max-w-6xl flex flex-col md:flex-row">
                {/* LEFT PANEL — Proposal Details */}
                <div className="flex-1 border-r border-gray-200 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Retriever Proposal Request Form
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Template to copy and paste when emailing stakeholder so they can join our platform.
                    </p>

                   <div className="w-full border-1 border-black"></div>

                   

                    <div className=" flex flex-col">
                        <div className="h-3/4 min-h-full">
                            hi
                        </div>
                        <div className="flex justify-between mt-auto">
                            <button
                            onClick={() => router.push("/portal")}
                            className="hover:cursor-pointer hover:text-amber-100 bg-amber-400 text-black font-semibold py-2 px-6 transition duration-200"
                            >
                            Go Back
                            </button>

                            <button
                            onClick={handleCopy}
                            className="bg-black hover:bg-gray-500 cursor-pointer text-white font-semibold py-2 px-6 transition duration-200"
                            >
                            Copy
                            </button>
                        </div>
                        </div>

                </div> 

               
                </div>
        </div>
    );
}
