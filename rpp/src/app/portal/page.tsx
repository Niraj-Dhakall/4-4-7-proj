'use client'
import React, { useState, useEffect } from "react";
import ProjectPost from "@/components/projectPost";
import { useRouter } from "next/navigation"
import HeaderWithSidebar from "@/components/headerWithSidebar";
import { useSearchParams } from 'next/navigation'
interface Project {
    id: string
    title: string;
    date: Date;
    description: string;
    tags: string[];
    status: string;
    friendly: boolean;
    project_manager: {
        name: string;
        email: string;
        affiliation: string;
    };
    student_accepted: string[];
    student_app: string[];
}

export default function Portal() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/proposals/getProposals')

                if (!res.ok) {
                    throw new Error('Failed to fetch projects')
                }

                const data = await res.json()
                setProjects(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
                console.error('Error fetching projects:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])
    
    if (loading) {
        return (
            <div className="w-full">
                <HeaderWithSidebar />
                <div className="flex justify-center items-center min-h-screen">
                    <p>Loading projects...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full">
                <HeaderWithSidebar />
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <HeaderWithSidebar />
            <div className="flex justify-start flex-shrink-0">
                <div className="flex flex-col items-center  bg-white gap-4 p-6">
                    {projects.length === 0 ? (
                        <p>No projects available</p>
                    ) : (
                        projects.map((project, index) => (
                            <ProjectPost
                                key={index}
                                ProjectPost={{
                                    id: project.id,
                                    name: project.project_manager.name,
                                    affiliation: project.project_manager.affiliation,
                                    title: project.title,
                                    description: project.description,
                                    status: project.status,
                                    date: new Date(project.date)
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}