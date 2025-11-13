"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClassPage() {
  const router = useRouter();
  const [className, setClassName] = useState("");
  const [classSemester, setclassSemester] = useState("");
  const [sections, setSections] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [tempSection, setTempSection] = useState("");

  const handleAddSectionClick = () => {
    if (!className) {
      alert("Please enter the name of the class.");
      return;
    }

    if(!classSemester){alert("Please enter the semester for the class"); return;}
    setShowPopup(true);
  };

  const handleSaveSection = () => {
    if (tempSection.trim() === "") {
      alert("Section name cannot be empty.");
      return;
    }
    setSections([...sections, tempSection]);
    setTempSection("");
    setShowPopup(false);
  };

  const handleCreateClass = () => {
    if (!className || !classSemester) {
      alert("Please Enter a class name or class semester before creating a class.");
      return;
    }
    if (sections.length === 0) {
      alert("Please add at least one section.");
      return;
    }

    // Eventually replace this with your DB/API call:
    console.log({
      className,
      sections,
    });

    alert(`Class "${className}" created with ${sections.length} section(s)!`);
    router.push("/profile/admin"); // return to admin page
  };

  return (
    <div className="min-h-screen bg-amber-400 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create a New Class
        </h1>

        {/* Class Name Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Ex. CMSC 447"
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

        
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Class Semester
                </label>
            <input
              type="text"
              value={classSemester}
              onChange={(e) => setclassSemester(e.target.value)}
              placeholder="Ex. Spring or Fall"
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Add Section Button */}
          <div className="pt-4">
            <button
              onClick={handleAddSectionClick}
              className="w-full bg-black hover:bg-gray-800 cursor-pointer text-white font-semibold py-2 rounded-md transition-all"
            >
              + Add Section
            </button>
          </div>
        </div>

        {/* Section List */}
        {sections.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Added Sections
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {sections.map((section, i) => (
                <li key={i} className="text-gray-700">
                  {section}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Create Class Button */}
        <div className="mt-8">
          <button
            onClick={handleCreateClass}
            className="w-full bg-black hover:bg-amber-600 cursor-pointer text-white font-semibold py-2 rounded-md transition-all"
          >
            Create Class
          </button>
        </div>
      </div>

      {/* Popup for adding a section */}
      {showPopup && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-[2px] flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add Section
            </h2>
            <input
              type="text"
              value={tempSection}
              onChange={(e) => setTempSection(e.target.value)}
              placeholder="Enter section name (e.g., Section 001)"
              className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-white cursor-pointer bg-gray-500 hover:bg-gray-400 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                className="px-4 py-2 bg-black cursor-pointer text-white hover:bg-gray-800 rounded-md font-medium"
              >
                Save Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
