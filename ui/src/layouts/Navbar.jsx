import { Menu, Mic, MoonStar, Sun } from "lucide-react";
import { ethers } from "ethers"; // Import ethers for blockchain interaction
import Logo from "../assets/you.png";
import { useEffect, useState } from "react";
import { abi } from "../scdata/YouTubeClone.json";
import { CONTRACT_ADDRESS } from "../scdata/deployed_addresses.json";
import { useNavigate } from "react-router-dom"; // For navigation

// Navbar component
const Navbar = ({ toggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [userAddress, setUserAddress] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState("");

  const navigate = useNavigate(); // For navigation to the search results page

  useEffect(() => {
    document.body.classList[isDarkMode ? "add" : "remove"]("dark");
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const connectWalletAutomatically = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
  
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          setUserAddress(userAddress);
          console.log("Connected wallet:", userAddress);
  
          const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
          const userDetails = await contract.getUser(userAddress);
          setUsername(userDetails[0]); // This is still necessary to set the state
          console.log(`Username: ${userDetails[0]}`);
  
          // Pass userDetails[0] directly to checkUserRegistration
          await checkUserRegistration(contract, userAddress, userDetails[0]);
        } else {
          console.error("MetaMask is not installed");
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };
  
    connectWalletAutomatically(); // Automatically connect wallet on component mount
  }, []);
  
  const checkUserRegistration = async (contract, userAddress, username) => {
    console.log(`Username test: ${username}`);
    try {
      if (username) {
        console.log("Registered");
      } else {
        console.error("User is not registered.");
      //   const confirmRegister = window.confirm("User is not registered. Would you like to register?");
      // if (confirmRegister) {
        await registerUser(contract);  // Call the registerUser function
      // }
      }
    } catch (error) {
      console.error("Error checking user registration:", error);
    }
  };
  
  const registerUser = async (contract) => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
    
        const enteredName = prompt("Please enter your name");
        console.log(enteredName);
    
        if (enteredName) {
          const tx = await contract.registerUser(enteredName); // Use enteredName directly
          await tx.wait();
    
          console.log("User registered successfully");
    
          // Check again if the user is registered
          const userAddress = await signer.getAddress();
          await checkUserRegistration(contract, userAddress, enteredName); // Pass enteredName directly to check registration
        } else {
          alert("Username cannot be empty.");
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  

  // Function to toggle dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };



  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900">
      <nav className="flex items-center justify-between py-2 pb-5 px-4">
        {/* Rendering left section of the navbar */}
        <HeaderLeftSection toggleSidebar={toggleSidebar} />

        {/* User info and dark mode toggle section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-700"
          >
            {isDarkMode ? (
              <Sun className="dark:text-neutral-400" />
            ) : (
              <MoonStar className="dark:text-neutral-400" />
            )}
          </button>

          {/* Displaying the connected wallet address and username */}
          {userAddress ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold dark:text-neutral-300">
                {username ? `${username} (${userAddress})` : userAddress}
              </span>
            </div>
          ) : (
            <span>Connecting wallet...</span>
          )}
        </div>
      </nav>
    </header>
  );
};

// Component for the left section of the navbar
export const HeaderLeftSection = ({ toggleSidebar }) => {
  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-700"
      >
        <Menu className="dark:text-neutral-400" />
      </button>
      <a className="flex items-center gap-2" href="#">
        <img src={Logo} width={70} alt="Logo" />
        <h2 className="text-xl font-bold dark:text-neutral-300">DYouTube</h2>
      </a>
    </div>
  );
};

export default Navbar;
