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
        <div className="flex h-full w-full justify-center">
            <div className="flex flex-col h-dvh w-3/4 bg-black">
                <div className="flex rounded-lg justify-center items-baseline  w-full h-[50px]">
                    <Hamburger toggled={hamburgerMenuOpen} toggle= {setHamburgerMenuOpen}></Hamburger>
                    <SearchBar></SearchBar>
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

    );
}