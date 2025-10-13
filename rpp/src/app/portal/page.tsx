'use client'
import React, { useState } from "react";
import Header from "@/components/header";
import ProjectPost from "@/components/projectPost";
import { SidebarComponent } from "@/components/sidebar";

export default function Portal(){
    const [sidebarOpen, setSidebarOpen] = useState(false)
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

    // <div className="flex flex-col w-full min-h-screen">
    //         <div className="top-0 bg-black w-full z-20">
    //             <Header hamburgerMenuOpen={sidebarOpen} setHamburgerMenuOpen={setSidebarOpen}></Header>
    //         </div>
            
    //         <div className="flex">
    //             <div className="flex flex-col bg-gray-300 w-full items-center justify-center sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-5 overflow-y-auto min-h-[calc(100vh-64px)]">
    //                 {testdata.map((project) =>(
    //                     <div key={project.name + project.title + project.date.getTime()} className="w-full max-w-4xl">
    //                         <ProjectPost ProjectPost={project}/>
    //                     </div>
    //                 ))}
    //             </div>
                
                
    //         </div>
    //         {sidebarOpen &&
    //             <div
    //                 className={`absolute top-0 right-0 h-full w-64 sm:w-72 md:w-80 bg-black shadow-lg transform transition-transform duration-300 z-30
    //                 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
    //                 `}
    //             >
    //                 <div className="pt-16 sm:pt-20">
    //                     <SidebarComponent />
    //                 </div>
    //             </div>
                
    //             }
    //     </div>
    return(
        <div className="w-full h-full">
            <div className="fixed top-0 left-0 right-0 z-20 bg-black">
                <Header hamburgerMenuOpen={sidebarOpen} setHamburgerMenuOpen={setSidebarOpen}/>
            </div>
            
            <div className="pt-16 mt-5 bg-gray-300 flex justify-center w-full min-h-screen">
                {sidebarOpen && (
            <div className="fixed top-16 mt-2 left-0 h-full w-64 sm:w-72 md:w-80 bg-black shadow-lg transform transition-transform duration-300 z-40 overflow-y-auto">
                
                    <SidebarComponent />
                
            </div>
            )}
                <div className="flex flex-col gap-2 max-h-100vh items-center  w-full overflow-y-auto px-4">
                    {testdata.map((project) =>(
                        <div key={project.name + project.title + project.date.getTime()} className="w-full flex justify-center max-w-4xl">
                            <ProjectPost ProjectPost={project}/>
                        </div>
                        ))}
                </div>
                
            </div>

            
        </div>
    );
}