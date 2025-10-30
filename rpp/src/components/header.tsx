"use client";
import React from "react";
import SearchBar from "@/components/searchBar";
import Hamburger from "hamburger-react";

interface HeaderProps {
    hamburgerMenuOpen: boolean;
    setHamburgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
    hamburgerMenuOpen,
    setHamburgerMenuOpen,
}: HeaderProps) {
    return (
        <header className="bg-black shadow-sm w-full max-h">
            <div className="flex items-center justify-between  py-3 max-w-auto px-2 mx-auto">
                <div className="flex items-center justify-start  max-w-md">
                    <div className="ml-auto ">
                        <Hamburger
                            toggled={hamburgerMenuOpen}
                            toggle={setHamburgerMenuOpen}
                            size={20}
                        />
                    </div>
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            UMBC RPP
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4 flex-1 max-w-md">
                    <SearchBar />
                </div>
            </div>
        </header>
    );
}
