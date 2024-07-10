require("@nomicfoundation/hardhat-toolbox");

const BNB_TESTNET_RPC_URL = process.env.rpcUrlOnDestChain
  ? process.env.rpcUrlOnDestChain
  : "https://bsc-testnet.public.blastapi.io";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",

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


