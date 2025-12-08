'use client'
import React, { useState, useEffect } from "react";
import ProjectPost from "@/components/projectPost";
import { useRouter, useSearchParams } from "next/navigation"
import HeaderWithSidebar from "@/components/headerWithSidebar";
import { getSession } from "../actions/auth";
import PlaceholderLoading from 'react-placeholder-loading'
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
    const searchParams = useSearchParams()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [session, setSession] = useState<any>(null)
    const [sessionLoading, setSessionLoading] = useState(true)



    // TODO add controller
    {/* line 60: const controller = new AbortController() after 80: return () => controller.abort() */ }
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const sessionData = await getSession()
                setSession(sessionData)

                if (!sessionData) {
                    router.push("/login")
                }
            } catch (err) {
                console.error('Error fetching session:', err)
                router.push("/login")
            } finally {
                setSessionLoading(false)
            }
        }

        fetchSession()
    }, [router])

    useEffect(() => {
        if (!session || sessionLoading) return

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
    }, [session, sessionLoading])

    if (loading || sessionLoading) {
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

    if (!session) {
        return null
    }

    return (
        <div className="w-full h-screen flex flex-col overflow-hidden">
            <HeaderWithSidebar />
            <div className="flex justify-center flex-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 overflow-hidden">
                <div className="flex flex-col items-center gap-4 p-6 w-full overflow-y-auto scrollbar-hide">

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
