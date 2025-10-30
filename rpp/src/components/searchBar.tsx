"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    interface DebounceFunction {
        (...args: any[]): void;
    }
    const handleResultClick = (searchTerm: string) => {
        router.push(`/project/${encodeURIComponent(searchTerm)}`);
        setSearchTerm("");
        setSearchResults([]);
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
                setSearchResults([]);
            } else {
                try {
                    const res = await fetch("/api/proposals/getProposals");
                    const projects = await res.json();
                    const filtered = projects.filter(
                        (project: any) =>
                            project.title
                                .toLowerCase()
                                .includes(term.toLowerCase()) ||
                            project.description
                                .toLowerCase()
                                .includes(term.toLowerCase()) ||
                            project.tags.some((tag: string) =>
                                tag.toLowerCase().includes(term.toLowerCase())
                            )
                    );
                    setSearchResults(filtered.slice(0, 5));
                } catch (error) {
                    console.error("Search failed:", error);
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
                        className="w-full  border border-gray-700 bg-gray-800 placeholder-gray-400 pl-12 pr-5 py-2.5 text-white"
                        placeholder="Search..."
                    />
                </div>
            </form>
            {searchResults.length > 0 && (
                <div className="absolute top-full w-full max-w-4xl  bg-gray-800 border border-gray-700 p-4 shadow-xl z-50">
                    <h2 className="mb-4 text-xl font-bold text-white">
                        {" "}
                        Search Results:{" "}
                    </h2>
                    <ul>
                        {searchResults.map((project: any, index: number) => (
                            <li
                                key={index}
                                onClick={() => handleResultClick(project.id)}
                                className="p-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-0"
                            >
                                <h3 className="text-white font-semibold">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm truncate">
                                    {project.description}
                                </p>
                                <div className="flex gap-2 mt-1">
                                    {project.tags
                                        .slice(0, 3)
                                        .map((tag: string, i: number) => (
                                            <span
                                                key={i}
                                                className="text-xs bg-amber-600 text-white px-2 py-1 "
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
