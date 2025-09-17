'use client'
import React, { useState } from "react";
import SearchBar from "@/components/searchBar";
import Hamburger from 'hamburger-react'
export default function Portal(){
    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);

    return(
        <div className="flex h-full w-full justify-center">
            <div className="flex flex-col h-dvh w-3/4 bg-black">
                <div className="flex rounded-lg justify-center items-baseline  w-full h-[50px]">
                    <Hamburger toggled={hamburgerMenuOpen} toggle= {setHamburgerMenuOpen}></Hamburger>
                    <SearchBar></SearchBar>
                </div>
                
                
            </div>
        </div>

    );
}