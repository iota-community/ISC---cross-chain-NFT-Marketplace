require("@nomicfoundation/hardhat-toolbox");

const BNB_TESTNET_RPC_URL = process.env.rpcUrlOnDestChain
  ? process.env.rpcUrlOnDestChain
  : "https://bsc-testnet-dataseed.bnbchain.org";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200 // Adjust the number of runs for optimization
      }
    }
  },
  
  networks: {
    'shimmerevm-testnet': {
        url: 'https://json-rpc.evm.testnet.shimmer.network',
        chainId: 1073,
        accounts: ["YOUR_PRIVATE_KEY"],
    },

    'bnbTestnet': {
      chainId: 97,
      url: BNB_TESTNET_RPC_URL,
      accounts: ["YOUR_PRIVATE_KEY"],
    },
  }
};


