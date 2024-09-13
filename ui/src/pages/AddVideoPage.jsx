import React from 'react'
import { useEffect, useState } from "react";
import CategoryPill from "../components/CategoryPill";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";
import { categories, videos } from "../constants";

const AddVideoPage = () => {
    //video upload
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName('');
        }
    };
    // State variable to track sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Effect hook to show sidebar on large devices initially
    useEffect(() => {
        if (window.innerWidth >= 768) setIsSidebarOpen(true);
    }, []);
    return (
        <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="flex overflow-auto">
                <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                {/* Overlay for mobile to close sidebar */}
                <div
                    onClick={toggleSidebar}
                    className={`md:hidden ${!isSidebarOpen && "opacity-0 pointer-events-none"
                        } transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
                ></div>

                <div
                    className={`w-full px-4 overflow-x-hidden custom_scrollbar ${isSidebarOpen && "hide_thumb"
                        }`}
                >
                    {/* Category list */}
                    <div className="sticky bg-white top-0 z-10 pb-3 flex gap-3 overflow-y-auto no_scrollbar dark:bg-neutral-900">
                        {categories.map((category) => (
                            <CategoryPill key={category} category={category} />
                        ))}
                    </div>

                    {/* Video grid */}


                    <form>
                    <div className="flex flex-col items-center justify-center w-full min-h-screen">
                        <div className="flex items-center justify-center w-full max-w-md">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Display the selected file name */}
                        {selectedFileName && (
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Selected file: {selectedFileName}
                            </div>
                        )}
                        <input type="text" className='mt-4 h-10 w-full max-w-md bg-gray-400 rounded-lg dark:bg-gray-600  placeholder:text-black pl-3' placeholder="Add Video Title Here..." />
                        <input type="text" className='mt-4 h-10 w-full max-w-md bg-gray-400 rounded-lg dark:bg-gray-600  placeholder:text-black pl-3' placeholder="Add Video Description Here..." />
                        <button className='mt-4 h-10 text-white w-full max-w-md flex items-center justify-center bg-violet-700 rounded-lg'>Upload</button>
                    </div>
                    </form>


                </div>
            </div>
        </div>
    )
}

export default AddVideoPage