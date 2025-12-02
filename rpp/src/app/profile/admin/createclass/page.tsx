"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateSection from "@/components/CreateSection";
import GoBackButton from "@/components/GoBackButton";
import ErrorComponent from "@/components/error";
export default function CreateClassPage() {
    const router = useRouter();
    const [className, setClassName] = useState("CMSC447");
    const [classSemester, setclassSemester] = useState("");
    const [classId, setClassId] = useState<string | null>(null);
    const [sections, setSections] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isCheckingClass, setIsCheckingClass] = useState(false);
    const [error, setError] = useState({
        type: "",
        message: "",
    });

    useEffect(() => {
        const checkExistingClass = async () => {
            if (!classSemester || !className) return;

            setIsCheckingClass(true);
            try {
                const checkRes = await fetch(
                    "/api/classes/getClassByNameAndSemester",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: className,
                            semester: classSemester,
                        }),
                    }
                );

                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (checkData.response) {
                        setClassId(checkData.response.id);
                        const existingSections =
                            checkData.response.sections || [];
                        setSections(
                            existingSections.map(
                                (s: any) => `Section ${s.sec_number}`
                            )
                        );
                    } else {
                        setClassId(null);
                        setSections([]);
                    }
                } else {
                    setClassId(null);
                    setSections([]);
                }
            } catch (err) {
                setClassId(null);
                setSections([]);
            } finally {
                setIsCheckingClass(false);
            }
        };

        checkExistingClass();
    }, [classSemester, className]);

    const handleDisplaySection = () => {
        setShowPopup(false);
    };
    const handleAddSectionClick = async () => {
        if (!classSemester) {
            alert("Please enter the semester for the class");
            return;
        }

        if (!classId) {
            setIsCheckingClass(true);
            setError({ type: "", message: "" });

            try {
                const checkRes = await fetch(
                    "/api/classes/getClassByNameAndSemester",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: className,
                            semester: classSemester,
                        }),
                    }
                );

                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (checkData.response) {
                        setClassId(checkData.response.id);
                        const existingSections =
                            checkData.response.sections || [];
                        setSections(
                            existingSections.map(
                                (s: any) => `Section ${s.sec_number}`
                            )
                        );
                        setIsCheckingClass(false);
                        setShowPopup(true);
                        return;
                    }
                }

                const createRes = await fetch("/api/classes/createClass", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: className,
                        semester: classSemester,
                    }),
                });

                if (!createRes.ok) {
                    const errorData = await createRes.json();
                    setError({
                        type: "error",
                        message: errorData.error || "Failed to create class",
                    });
                    setIsCheckingClass(false);
                    return;
                }

                const createData = await createRes.json();
                setClassId(createData.response.id);
                setIsCheckingClass(false);
            } catch (err) {
                setError({
                    type: "error",
                    message: "Failed to create or retrieve class",
                });
                setIsCheckingClass(false);
                return;
            }
        }

        setShowPopup(true);
    };

    const handleSectionCreated = (sectionNumber: string) => {
        setSections([...sections, sectionNumber]);
        setShowPopup(false);
    };

    const handleCreateClass = async () => {
        if (!className || !classSemester) {
            alert(
                "Please Enter a class name or class semester before creating a class."
            );
            return;
        }
        if (sections.length === 0) {
            alert("Please add at least one section.");
            return;
        }

        alert(
            `Class "${className} ${classSemester}" with ${sections.length} section(s) is ready!`
        );
    };

    return (
        <div className="min-h-screen bg-amber-400 flex justify-center gap-2 items-center">
            <div className="bg-white rounded-lg p-10 w-full max-w-lg">
                <div>
                    <GoBackButton route="/profile" />
                </div>
                <ErrorComponent Type={error.type} Message={error.message} />
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Create a New Class
                </h1>
                {/* Class Name Fields */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Class Name
                        </label>
                        <input
                            type="text"
                            value="CMSC447"
                            disabled
                            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md disabled: bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Class Semester
                        </label>
                        <input
                            type="text"
                            value={classSemester}
                            onChange={(e) => setclassSemester(e.target.value)}
                            placeholder="Ex. Spring or Fall"
                            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        {classId && classSemester && (
                            <p className="text-sm text-green-600 mt-2">
                                Class already exists. You can add more sections.
                            </p>
                        )}
                    </div>

                    {/* Add Section Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleAddSectionClick}
                            disabled={isCheckingClass}
                            className="w-full bg-black hover:bg-gray-800 cursor-pointer text-white font-semibold py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCheckingClass ? "Checking..." : "+ Add Section"}
                        </button>
                    </div>
                </div>
                {/* Section List */}
                {sections.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Added Sections
                        </h2>
                        <ul className="list-disc list-inside space-y-1">
                            {sections.map((section, i) => (
                                <li key={i} className="text-gray-700">
                                    {section}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Create Class Button */}
                <div className="mt-8">
                    <button
                        onClick={handleCreateClass}
                        className="w-full bg-black hover:bg-amber-600 cursor-pointer text-white font-semibold py-2 rounded-md transition-all"
                    >
                        {classId ? "Done" : "Create Class"}
                    </button>
                </div>
            </div>
            {/* Popup for adding a section */}
            {showPopup && classId && (
                <div className="bg-opacity- backdrop-blur-[4px] flex justify-center transition-transform duration-1000 ease-in-out items-center z-50">
                    <div
                        className={`transform transition-transform duration-500 ease-in-out ${
                            showPopup
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                        }`}
                    >
                        <CreateSection
                            handleDisplaySection={handleDisplaySection}
                            classId={classId}
                            onSectionCreated={handleSectionCreated}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
