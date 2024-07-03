require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",

  networks: {
    'shimmerevm-testnet': {
        url: 'https://json-rpc.evm.testnet.shimmer.network',
        chainId: 1073,
        accounts: ["4be05ce6dbcad7e19152b6e1e8fa708285c7c941ecd2c069cc904dd54091fde6"],
    },
  }
};


