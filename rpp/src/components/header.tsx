'use client'
import React from "react"
import SearchBar from "@/components/searchBar";
import Hamburger from 'hamburger-react'
import { useState } from "react";

export default function Header(){
    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
    return(
    <div className="relative w-full">
        <div className="">
            <SearchBar></SearchBar>
        </div>
        <div className="flex items-center justify-between w-full p-4">
            <div className="w-0"></div>
            <div className="text-xl font-bold">
                UMBC RPP
            </div>
            <div>
                <Hamburger toggled={hamburgerMenuOpen} toggle= {setHamburgerMenuOpen}></Hamburger>
            </div>
        </div>
    </div>
    );
}