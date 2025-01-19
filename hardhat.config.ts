import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const { vars } = require("hardhat/config");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${vars.get("MM_AK")}`,
      accounts: [`${vars.get("MM_MM1_PKS")}`],
    },
  }
};
export default config;
