# YouTube Clone dApp - README

## Overview

This decentralized application (dApp) is a YouTube clone built on the Ethereum blockchain. It allows users to upload, view, and manage videos in a decentralized manner using their MetaMask wallet. Video data is stored on IPFS via Pinata, ensuring decentralized and secure file storage.

## Key Features

1. **Video Upload Page**: Users can upload videos by selecting a file, providing a title, and adding a description.
2. **Home Page**: Displays all uploaded videos from various MetaMask accounts.
3. **My Videos Page**: Displays videos uploaded by the logged-in user, allowing them to manage their content.
4. **User Authentication**:
   - If the user is registered, their username and MetaMask address will be shown in the navbar.
   - If the user is not registered, they are prompted to register by entering a username.

## Tech Stack

### Frontend
- **React**: For building UI components and handling frontend logic.
- **Vite**: Fast development build and bundling tool.
- **Tailwind CSS**: Utility-first CSS framework for responsive styling.
- **Ethers.js**: Ethereum library to interact with the smart contracts.
- **MetaMask**: Ethereum wallet for user authentication and transaction signing.

### Backend
- **Solidity**: Smart contract language for developing video management logic.
- **Ethereum**: Blockchain platform used for deploying smart contracts.
- **Hardhat**: Ethereum development environment for testing and deployment.
- **Pinata**: Used for IPFS integration, allowing decentralized video file storage.

## Smart Contracts

The smart contracts provide functionality for:
1. Uploading videos to IPFS (storing metadata like title, description, and the video file).
2. Listing all videos across the platform.
3. Fetching videos uploaded by the currently logged-in user.

## Prerequisites

Before running the project, ensure that you have the following set up:

- **Node.js**: Install from [Node.js official site](https://nodejs.org/).
- **MetaMask**: Download and install the MetaMask browser extension.
- **Infura Account**: Set up an account on [Infura](https://infura.io/) to connect to Ethereum networks.
- **Pinata Account**: Register for [Pinata](https://pinata.cloud/) to handle IPFS file storage.

## Installation

### 1. Clone the Repository:
```bash
git clone https://github.com/your-repo/youtube-clone-dapp.git
```
