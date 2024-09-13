// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YouTubeClone {
    struct Video {
        uint256 id;
        string title;
        string description;
        string ipfsHash;  // IPFS hash of the video
        address uploader;
        uint256 timestamp;
    }

    struct User {
        string username;
        address userAddress;
    }

    uint256 public videoCount = 0;
    mapping(uint256 => Video) public videos;  // Maps video ID to Video struct
    mapping(address => User) public users;    // Maps user address to User struct
    mapping(address => uint256[]) public userVideos; // Maps user address to their uploaded video IDs

    event VideoUploaded(
        uint256 id,
        string title,
        string description,
        string ipfsHash,
        address uploader,
        uint256 timestamp
    );

    event UserRegistered(
        address userAddress,
        string username
    );

    // Modifier to check if the user is registered
    modifier onlyRegisteredUser() {
        require(bytes(users[msg.sender].username).length > 0, "User is not registered.");
        _;
    }

    // Function to register a new user with a username
    function registerUser(string memory _username) public {
        require(bytes(_username).length > 0, "Username cannot be empty.");
        require(bytes(users[msg.sender].username).length == 0, "User is already registered.");
        
        users[msg.sender] = User(_username, msg.sender);

        emit UserRegistered(msg.sender, _username);
    }

    // Function to upload a video (IPFS hash, title, description)
    function uploadVideo(string memory _title, string memory _description, string memory _ipfsHash) public onlyRegisteredUser {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty.");
        require(bytes(_title).length > 0, "Title cannot be empty.");
        
        videoCount++;
        videos[videoCount] = Video(videoCount, _title, _description, _ipfsHash, msg.sender, block.timestamp);
        userVideos[msg.sender].push(videoCount); // Track the video ID for the user

        emit VideoUploaded(videoCount, _title, _description, _ipfsHash, msg.sender, block.timestamp);
    }

    // Function to fetch video details by ID
    function getVideo(uint256 _id) public view returns (string memory, string memory, string memory, address, uint256) {
        require(_id > 0 && _id <= videoCount, "Video does not exist.");
        
        Video memory v = videos[_id];
        return (v.title, v.description, v.ipfsHash, v.uploader, v.timestamp);
    }

    // Function to get user details
    function getUser(address _userAddress) public view returns (string memory, address) {
        User memory user = users[_userAddress];
        return (user.username, user.userAddress);
    }

    // Function to fetch all videos uploaded by the logged-in user
    function getMyVideos() public view onlyRegisteredUser returns (uint256[] memory) {
        return userVideos[msg.sender];
    }

    // Function to fetch all videos uploaded by a specific user
    function getUserVideos(address _userAddress) public view returns (uint256[] memory) {
        return userVideos[_userAddress];
    }

    // Function to list all videos uploaded on the platform
    function listAllVideos() public view returns (Video[] memory) {
        Video[] memory allVideos = new Video[](videoCount);
        for (uint256 i = 1; i <= videoCount; i++) {
            allVideos[i - 1] = videos[i];
        }
        return allVideos;
    }

    // Function to search videos by title (partial or full match)
    function searchVideosByTitle(string memory _title) public view returns (Video[] memory) {
        uint256 resultCount = 0;
        
        // First count how many videos match the search
        for (uint256 i = 1; i <= videoCount; i++) {
            if (contains(videos[i].title, _title)) {
                resultCount++;
            }
        }

        // Create an array for the matching videos
        Video[] memory matchingVideos = new Video[](resultCount);
        uint256 index = 0;
        
        // Populate the array with matching videos
        for (uint256 i = 1; i <= videoCount; i++) {
            if (contains(videos[i].title, _title)) {
                matchingVideos[index] = videos[i];
                index++;
            }
        }

        return matchingVideos;
    }

    // Helper function to check if one string contains another
    function contains(string memory _a, string memory _b) internal pure returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);

        if (b.length > a.length) {
            return false;
        }

        for (uint256 i = 0; i <= a.length - b.length; i++) {
            bool matchFound = true;
            for (uint256 j = 0; j < b.length; j++) {
                if (a[i + j] != b[j]) {
                    matchFound = false;
                    break;
                }
            }
            if (matchFound) {
                return true;
            }
        }

        return false;
    }
}
