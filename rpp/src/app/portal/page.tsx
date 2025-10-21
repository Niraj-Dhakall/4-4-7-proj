'use client'
import React, { useState } from "react";
import Header from "@/components/header";
import ProjectPost from "@/components/projectPost";
import { SidebarComponent } from "@/components/sidebar";
import { useRouter } from "next/navigation"
import {AiOutlinePlus} from "react-icons/ai";


export default function Portal(){
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    

    
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
            )}
                <div> 
                    <button onClick={() => router.push('/portalrequest') } className="btn flex font-semibold border hover:border-red-500 hover:cursor-pointer text-center btn-prmary w-full bg-black text-amber-200 rounded-lg p-2 ">
                         Create <AiOutlinePlus size={25}/> 
                    </button>
                    
                 </div>
                
                
            </div>

            
        </div>

            
        </div>
    );
}