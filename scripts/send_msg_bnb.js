const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() { 

  const agentPath = path.join(__dirname, 'addresses', 'Messanger_bnb.txt');
  const myAgentAddress = fs.readFileSync(agentPath, 'utf8').trim();

  const MyOFTBNBPath = path.join(__dirname, 'addresses', 'CrossChainToken_BNB.txt');
  const myOFTBNBAddress = fs.readFileSync(MyOFTBNBPath, 'utf8').trim();

  const MyONFTAddress = path.join(__dirname, 'addresses', 'MyONFT721_Bnb.txt');
  const myONFTAddress = fs.readFileSync(MyONFTAddress, 'utf8').trim();


  const crossChainAgent = await hre.ethers.getContractAt(
    "CrossChainAgent",
    myAgentAddress
  );
 
  const adapterParameter = hre.ethers.solidityPacked(
    ["uint16", "uint256"],
    [1, 2090000]
  );

  const options = { value: hre.ethers.parseUnits("635581099810983", "wei") };

  console.log(`Sending tokens from src chain to dest chain`);

  // NOTE: replace the parameters with the correct values
  const tx = await crossChainAgent.buyCrossChain(
    10230,
    "0xDC0A1c49DD32661eA013797e75f66674f6EC2C4B", // user address
    myOFTBNBAddress, // ERC0 token address to transfer
    myONFTAddress,
    1, // nft id
    1, // amount of ERC20 to transfer (should equal to the price of the NFT)
    "0x2e1c6d4e8f9a5d5c7a1a0f2b0b2d7b0b4f6e4f8c", // refund address
    adapterParameter,
    options
  );

  console.log(tx.hash);
  tx.wait();
  console.log(`Done sending message from src chain to dest chain`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
