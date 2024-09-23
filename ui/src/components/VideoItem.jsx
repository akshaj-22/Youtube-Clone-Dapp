import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import YouTubeCloneABI from "../scdata/YouTubeClone.json";

const contractAddress = "0x8a6d33328ea422533A5e93805b83C0D9151aAA14";

const VideoItem = ({ video }) => {
  const [uploaderUsername, setUploaderUsername] = useState(""); // State to store uploader's username

  // Function to fetch uploader's username from the contract
  const fetchUploaderUsername = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      // Set up ethers provider and contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, YouTubeCloneABI.abi, signer);

      // Fetch uploader's username using the getUser function from the contract
      const [username] = await contract.getUser(video.uploader);
      setUploaderUsername(username);
    } catch (error) {
      console.error("Error fetching uploader's username:", error);
    }
  };

  // Fetch uploader's username when the component mounts
  useEffect(() => {
    fetchUploaderUsername();
  }, [video.uploader]); // Re-run if the uploader changes

  // Construct the IPFS video URL using the IPFS hash stored in the contract
  const videoUrl = `https://gateway.pinata.cloud/ipfs/${video.ipfsHash}`;

  return (
    <a className="group" href={videoUrl} target="_blank" rel="noopener noreferrer">
      <div className="relative">
        {/* Video tag to play video directly from IPFS */}
        <video
          className="rounded-lg aspect-video"
          controls
          src={videoUrl}  // Load the video from IPFS using the hash
          alt={video.title}
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        {/* You can add video duration if you store it in metadata */}
        <p className="absolute bottom-2 right-2 text-sm bg-black bg-opacity-50 text-white px-1.5 font-medium rounded-md">
          {video.duration || "Unknown duration"}
        </p>
      </div>

      <div className="flex gap-3 py-3 px-2">
        {/* Display uploader info */}
        <img
          className="h-9 w-9 rounded-full"
          src={video.uploaderLogo || "https://via.placeholder.com/100"} // Placeholder for uploader logo
          alt={uploaderUsername || "Uploader"}
        />
        <div>
          <h2
            className="group-hover:text-blue-500 font-semibold leading-snug line-clamp-2 dark:text-neutral-300"
            title={video.title}
          >
            {video.title}
          </h2>
          {/* Uploader's username and upload timestamp */}
          <p className="text-sm mt-1 text-neutral-700 hover:text-neutral-500 dark:text-neutral-300">
            {uploaderUsername || "Unknown uploader"}
          </p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {new Date(video.timestamp * 1000).toLocaleString()} {/* Convert timestamp to readable date */}
          </p>
        </div>
      </div>
    </a>
  );
};

export default VideoItem;
