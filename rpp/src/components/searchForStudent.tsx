"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Student {
    id: string;
    email: string;
    name: string;
    major: string[];
    year: string;
    gpa: number;
    skills: string[];
    courses: string[];
    graduation: string;
    applications: string[];
    accepted: string[];
    portfolio: string | null;
}

interface SearchForStudentProps {
    onStudentSelect?: (student: Student) => void;
}

export default function SearchForStudent({ onStudentSelect }: SearchForStudentProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Student | null>(null);
    interface DebounceFunction {
        (...args: any[]): void;
    }
    const handleResultClick = (student: Student) => {
        if (onStudentSelect) {
            onStudentSelect(student);
        }
        setSearchTerm("");
        setSearchResults(null);
    };
    const debounce = (
        func: (...args: any[]) => void,
        delay: number
    ): DebounceFunction => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };
    const handleSearch = useCallback(
        debounce(async (term) => {
            if (term.trim() === "") {
                setSearchResults(null);
            } else {
                try {
                    const res = await fetch(
                        `/api/students/getStudentByEmail?email=${term}`
                    );
                    const student = await res.json();
                    setSearchResults(student);
                } catch (error) {
                    console.error("Search failed:", error);
                    setSearchResults(null);
                }
            }
        }, 300),
        []
    );

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, handleSearch]);

    const handleInputChange = (e: any) => {
        setSearchTerm(e.target.value);
    };
    return (
        <div className="flex w-full flex-wrap relative">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full max-w-4xl md:max-w-2xl"
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="w-full  border border-gray-700 bg-white placeholder-gray-400 pl-12 pr-5 py-2.5 text-black"
                        placeholder="Search..."
                    />
                </div>
            </form>
            {searchResults && (
                <div className="absolute top-full w-full max-w-4xl bg-white border border-gray-700 shadow-xl z-50">
                    <div
                        onClick={() => handleResultClick(searchResults)}
                        className="p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                        <h3 className="text-black font-semibold text-lg">
                            {searchResults.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {searchResults.email}
                        </p>

                    </div>
                </div>
            )}
        </div>
    );
}
