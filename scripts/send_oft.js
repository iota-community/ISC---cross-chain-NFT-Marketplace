// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() { 

  // execute sendFrom function

   //const myTokenAddress = "0xC5Df740512d04e885fc245cb33E39208b17fC78e";
  // "PASTE BAOBAB DEPLOYED CONTRACT ADDRESS HERE";

  
  const tokenAddressPath = path.join(__dirname, 'addresses', 'CrossChainToken_BNB.txt');
  const myTokenAddress = fs.readFileSync(tokenAddressPath, 'utf8').trim();


  const crosschainTokenSRC = await hre.ethers.getContractAt(
    "CrossChainToken",
    myTokenAddress
  );


  // instructs LayerZero to use a custom amount of gas
  // v1 adapterParams, encoded for version 1 style, and 200k gas quote
  const adapterParameter = hre.ethers.solidityPacked(
    ["uint16", "uint256"],
    [1, 2009000]
  );


  // console.log(adapterParameter);

  // execute the sendFrom function
  // from: the owner of token
  // _destChainId: 10230
  // _toAddress:  insert the recipient address on the dest chain
  //  _amount: amount of tokens you want to send in Wei
  // refundAddress: address to receive gas refunds
  //  _zroPaymentAddress: specify address zero (0x0000000000000000000000000000000000000000)
  //   _adapterParams: 0x00010000000000000000000000000000000000000000000000000000000000030d40

  /*address _from,
        uint16 _dstChainId,
        bytes calldata _toAddress,
        uint _amount,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams8*/

  // PASTE THE ESTIMATE FEE VALUE HERE
  const options = { value: hre.ethers.parseUnits("635581099810983", "wei") };

  console.log(`Sending tokens from src chain to dest chain`);
  const tx = await crosschainTokenSRC.sendTokensWithMessage(
    "0x7d0f6517DdF1D0F96a1050f1Dda7ee77323ceC0B",
    10230,
    "0x7d0f6517DdF1D0F96a1050f1Dda7ee77323ceC0B",
    "10000000000000000000",
    "0x7d0f6517DdF1D0F96a1050f1Dda7ee77323ceC0B",
    "0x0000000000000000000000000000000000000000",
    adapterParameter,
    "0x7d0f6517DdF1D0F96a1050f1Dda7ee77323ceC0B",
    33,
    {
      value: hre.ethers.parseUnits("90034303244230903", "wei")
    }
  );

  console.log(tx.hash);
  tx.wait();
  console.log(`Done sending tokens from src chain to dest chain`);

  // npx hardhat run scripts/send-from.js --network baobab
  // KINDLY PASTE THIS HASH IN THE SEARCH FIELD OF THE LAYERZERO SCAN: https://testnet.layerzeroscan.com/

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
