require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config();
const infuraurl=process.env.infuraurl;
const privatekey=process.env.metamaskprivatekey;
const hardhatlocalhost=process.env.hardhatlocalhost;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "infurasepolia",
  networks:{
    localhost:{
      url:hardhatlocalhost
    },
    infurasepolia: {
      url:infuraurl,
      accounts:[privatekey]
    }
  },
  solidity: "0.8.20",
};
