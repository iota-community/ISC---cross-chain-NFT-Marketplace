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
        accounts: ["4be05ce6dbcad7e19152b6e1e8fa708285c7c941ecd2c069cc904dd54091fde6"],
    },

    'bnbTestnet': {
      chainId: 97,
      url: BNB_TESTNET_RPC_URL,
      accounts: ["4be05ce6dbcad7e19152b6e1e8fa708285c7c941ecd2c069cc904dd54091fde6"],
    },
  }
};


