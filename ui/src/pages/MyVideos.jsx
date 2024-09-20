import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";
import VideoItem from "../components/VideoItem";
import CategoryPill from "../components/CategoryPill";
import { categories } from "../constants";
import YouTubeCloneABI from "../scdata/YouTubeClone.json"; // ABI of your contract

const MyVideos = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const contractAddress = "0x8a6d33328ea422533A5e93805b83C0D9151aAA14"; // Replace with your contract address

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch videos uploaded by the logged-in user
  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        if (!window.ethereum) {
          alert("MetaMask not installed!");
          return;
        }

        // Request accounts from MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Set up provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress(); // Get current user's address

        // Initialize contract
        const contract = new ethers.Contract(contractAddress, YouTubeCloneABI.abi, signer);

        // Fetch all videos using the listAllVideos function
        const allVideos = await contract.listAllVideos();

        // Filter videos by the current user's address (uploader)
        const userUploadedVideos = allVideos.filter((video) => video.uploader.toLowerCase() === userAddress.toLowerCase());

        // Map and format the videos data to be displayed
        const formattedVideos = userUploadedVideos.map((video) => ({
          id: video.id.toString(),
          title: video.title,
          description: video.description,
          ipfsHash: video.ipfsHash,
          uploader: video.uploader,
          timestamp: video.timestamp.toString(),
        }));

        setMyVideos(formattedVideos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    };

    fetchMyVideos();
  }, []);

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the video grid
  return (
    <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex overflow-auto">
        <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

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
          {myVideos.length > 0 ? (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-5 pb-6">
              {myVideos.map((video) => (
                // <div key={video.id} className="video-item">
                //   <h3>{video.title}</h3>
                //   <p>{video.description}</p>
                //   <video width="320" height="240" controls>
                //     <source
                //       src={`https://gateway.pinata.cloud/ipfs/${video.ipfsHash}`}
                //       type="video/mp4"
                //     />
                //     Your browser does not support the video tag.
                //   </video>
                // </div>
                <VideoItem key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full min-h-screen">
              <h1 className="dark:text-white">No Videos Added</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyVideos;
