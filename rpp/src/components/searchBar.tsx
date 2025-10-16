'use client'
import React, { useCallback, useEffect, useState } from "react";
import {Search} from 'lucide-react'

export default function SearchBar(){
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    interface DebounceFunction {
        (...args: any[]): void;
    }

    const debounce = (func: (...args: any[]) => void, delay: number): DebounceFunction => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };
        const handleSearch = useCallback(
        debounce((term) => {
        if (term.trim() === '') {
            // TODO
        } else {
            // TODO
        }
        }, 300),
        [],
    )
    
    useEffect(() => {
        handleSearch(searchTerm)
    }, [searchTerm, handleSearch])
    
    const handleInputChange = (e: any) => {
        setSearchTerm(e.target.value)
    }
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
            className="w-full  border border-gray-700 bg-gray-800 placeholder-gray-400 pl-12 pr-5 py-2.5 text-white focus:border-white"
            placeholder="Search..."
          />

        </div>
      </form>
      {searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-w-4xl rounded-lg bg-gray-800 border border-gray-700 p-4 shadow-xl z-50">
          <h2 className="mb-4 text-xl font-bold text-white"> Search Results: </h2>
          <ul>

            {searchResults.map((result) => (
              <div className="text-gray-300">
                hi
              </div>
              // TODO
            ))}
          </ul>
        </div>
      )}
    </div>

    );

}