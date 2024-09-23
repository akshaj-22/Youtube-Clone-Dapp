import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import CategoryPill from "../components/CategoryPill";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";
import { categories } from "../constants";
import { abi } from '../scdata/YouTubeClone.json';
import { CONTRACT_ADDRESS } from '../scdata/deployed_addresses.json';

// Pinata API credentials
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API;

const AddVideoPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (window.innerWidth >= 768) setIsSidebarOpen(true);
    }, []);

    // Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName('');
        }
    };

    // Upload video to Pinata (IPFS)
    const uploadToIPFS = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const options = {
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY
            }
        };

        try {
            const res = await axios.post(url, formData, options);
            return res.data.IpfsHash; // Returns the IPFS hash
        } catch (error) {
            console.error("Error uploading file to IPFS", error);
            return null;
        }
    };

    // Upload video metadata to the smart contract
    const uploadToBlockchain = async (ipfsHash) => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    
            try {
                const tx = await contract.uploadVideo(videoTitle, videoDescription, ipfsHash);
                await tx.wait();
                alert("Video uploaded successfully!");
            } catch (error) {
                console.error("Error uploading video to the contract", error);
            }
        } else {
            alert('MetaMask is not installed. Please install MetaMask and try again.');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile || !videoTitle || !videoDescription) {
            alert("Please fill in all fields.");
            return;
        }

        setIsUploading(true);

        // Step 1: Upload video to IPFS
        const ipfsHash = await uploadToIPFS();
        if (!ipfsHash) {
            alert("Error uploading video to IPFS");
            setIsUploading(false);
            return;
        }

        // Step 2: Upload video metadata to the smart contract
        await uploadToBlockchain(ipfsHash);

        setIsUploading(false);
    };

    const requestMetaMaskConnection = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User rejected MetaMask connection", error);
        }
    };

    // Call this when your component loads or before blockchain interaction
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            requestMetaMaskConnection();
        }
    }, []);

    return (
        <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="flex overflow-auto">
                <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                <div
                    onClick={toggleSidebar}
                    className={`md:hidden ${!isSidebarOpen && "opacity-0 pointer-events-none"
                        } transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
                ></div>

                <div className={`w-full px-4 overflow-x-hidden custom_scrollbar ${isSidebarOpen && "hide_thumb"}`}>
                    <div className="sticky bg-white top-0 z-10 pb-3 flex gap-3 overflow-y-auto no_scrollbar dark:bg-neutral-900">
                        {categories.map((category) => (
                            <CategoryPill key={category} category={category} />
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
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
                                        <p className="text-xs text-gray-500 dark:text-gray-400">MP4, WebM (Max 100MB)</p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="video/*"
                                    />
                                </label>
                            </div>

                            {selectedFileName && (
                                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    Selected file: {selectedFileName}
                                </div>
                            )}

                            <input
                                type="text"
                                className="mt-4 h-10 w-full max-w-md bg-gray-400 rounded-lg dark:bg-gray-600  placeholder:text-black pl-3"
                                placeholder="Add Video Title Here..."
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                className="mt-4 h-10 w-full max-w-md bg-gray-400 rounded-lg dark:bg-gray-600  placeholder:text-black pl-3"
                                placeholder="Add Video Description Here..."
                                value={videoDescription}
                                onChange={(e) => setVideoDescription(e.target.value)}
                            />

                            <button
                                className="mt-4 h-10 text-white w-full max-w-md flex items-center justify-center bg-violet-700 rounded-lg"
                                type="submit"
                                disabled={isUploading}
                            >
                                {isUploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVideoPage;
