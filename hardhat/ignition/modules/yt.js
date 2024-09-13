const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("youtubeclone", (m) => {
    const yt = m.contract("YouTubeClone");
    return(yt);
})