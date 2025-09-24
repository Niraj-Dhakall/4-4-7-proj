'use client'
import React, { useState } from "react";
import Header from "@/components/header";
import ProjectPost from "@/components/projectPost";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
export default function Portal(){
    const testdata =[
        {name: 'John Doe',
        affiliation: "University of Maryland, Baltimore County",
        title: "Virtual Triage System",
        description: "This is a test description designed to test the functionality of the ProjectPost component. As I keep typing, the text should end with a ... more",
        date: new Date("2025-09-23"),
        status:"Ongoing"
        },
        {name: 'M Doe',
        affiliation: "University of Maryland, Baltimore County",
        title: "UMBC Doordash System",
        description: "This is a test description designed to test the functionality of the ProjectPost component. As I keep typing, the text should end with a ... more",
        date: new Date("2025-09-23"),
        status:"Completed",
        },
        {name: 'Tom Doe',
        affiliation: "University of Maryland, Baltimore County",
        title: "Transcript Report System",
        description: "This is a test description designed to test the functionality of the ProjectPost component. As I keep typing, the text should end with a ... more",
        date: new Date("2025-09-23"),
        status: "Dropped"
        },
        {name: 'Von Doe',
        affiliation: "University of Maryland, Baltimore County",
        title: "Transcript Report System",
        description: "This is a test description designed to test the functionality of the ProjectPost component. As I keep typing, the text should end with a ... more",
        date: new Date("2025-09-23"),
        status: "Dropped"
        },
        {name: 'Tom Doe',
        affiliation: "University of Maryland, Baltimore County",
        title: "Transcript Report System",
        description: "This is a test description designed to test the functionality of the ProjectPost component. As I keep typing, the text should end with a ... more",
        date: new Date("2025-09-23"),
        status: "Ongoing"
        },
        {name: 'Tom Doe',
        affiliation: "University of Maryland, Baltimore County",
        title: "Transcript Report System2",
        description: "This is a test description designed to test the functionality of the ProjectPost component. As I keep typing, the text should end with a ... more",
        date: new Date("2025-09-23"),
        status: "Dropped"
        },
        {name: 'Tom Doe',
        affiliation: "University of Maryland, Baltimore County",
        title: "Transcript Report System",
        description: "This is a test description designed to test the functionality of the ProjectPost component. As I keep typing, the text should end with a ... more",
        date: new Date("2025-09-23"),
        status: "Ongoing"
        },
    ]
    return(
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="sticky top-0 bg-black w-full">
                <Header></Header>
            </div>
            <div className="flex flex-col bg-gray-300 w-full h-full items-center justify-start mt-3 gap-5">
                {testdata.map((project) =>(
                    <ProjectPost key ={project + project.name + project.title} ProjectPost={project}/>

                ))}
            </div>
        </div>

    );
}