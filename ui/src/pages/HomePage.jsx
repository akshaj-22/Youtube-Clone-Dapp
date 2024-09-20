import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CategoryPill from "../components/CategoryPill";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";
import VideoItem from "../components/VideoItem";
import { categories } from "../constants"; // assuming categories is still static

// Contract ABI and address (you should replace these with actual values)
import YouTubeCloneABI from "../scdata/YouTubeClone.json";
const contractAddress = "0x8a6d33328ea422533A5e93805b83C0D9151aAA14";

const HomePage = () => {
  // State variable to track sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State to store fetched videos from the blockchain
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
 

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect hook to show sidebar on large devices initially
  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

  // Function to fetch videos from the contract
  const fetchVideos = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      // Request accounts from MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Set up ethers provider and contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, YouTubeCloneABI.abi, signer);
      

      // Fetch all videos using the listAllVideos function from the contract
      const videoList = await contract.listAllVideos();
      console.log("Fetched videoList from contract:", videoList);

      // Map through each video and fetch metadata from IPFS using the IPFS hash (IPFS gateway URL)
      const fetchedVideos = await Promise.all(
        videoList.map(async (video) => {
          // Use the IPFS hash to fetch metadata (assuming it's an accessible IPFS URL)
          const ipfsGatewayUrl = `https://gateway.pinata.cloud/ipfs/${video.ipfsHash}`;
          
          // Optionally, you can fetch video data from the IPFS gateway (Pinata)
          // const response = await fetch(ipfsGatewayUrl);
          // const videoData = await response.json(); // Assuming JSON data

          // Return a video object containing relevant information
          return {
            id: video.id.toString(),
            title: video.title,
            description: video.description,
            ipfsHash: video.ipfsHash,
            uploader: video.uploader,
            timestamp: new Date(parseInt(video.timestamp) * 1000).toLocaleString(),
            videoUrl: ipfsGatewayUrl, // Use this to display the video
          };
        })
      );

      // Update the state with fetched videos
      setVideos(fetchedVideos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setLoading(false);
    }
  };

  // Fetch videos from the contract on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex overflow-auto">
        <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Overlay for mobile to close sidebar */}
        <div
          onClick={toggleSidebar}
          className={`md:hidden ${
            !isSidebarOpen && "opacity-0 pointer-events-none"
          } transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
        ></div>

        <div
          className={`w-full px-4 overflow-x-hidden custom_scrollbar ${
            isSidebarOpen && "hide_thumb"
          }`}
        >
          {/* Category list */}
          <div className="sticky bg-white top-0 z-10 pb-3 flex gap-3 overflow-y-auto no_scrollbar dark:bg-neutral-900">
            {categories.map((category) => (
              <CategoryPill key={category} category={category} />
            ))}
          </div>

          {/* Video grid */}
          {loading ? (
            <p>Loading videos...</p>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-5 pb-6">
              {videos.map((video) => (
                <VideoItem key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
