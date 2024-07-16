const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function setBatchSizeLimit(
  isForProxy,
  proxyONFTContractAddress,
  onftContractAddress,
  lzEndpointIdOnRemoteChain,
  batchSizeLimit,
) {
  console.log(
    `setBatchSizeLimit - isForProxy:${isForProxy}, proxyONFTContractAddress:${proxyONFTContractAddress}, onftContractAddress:${onftContractAddress}, lzEndpointIdOnRemoteChain:${lzEndpointIdOnRemoteChain}, batchSizeLimit:${batchSizeLimit}`,
  );

  const MyProxyONFT721Factory = await ethers.getContractFactory("MyProxyONFT721");
  const myProxyONFT721Contract = MyProxyONFT721Factory.attach(proxyONFTContractAddress);


  const tx = await myProxyONFT721Contract.setDstChainIdToBatchLimit(
    Number(lzEndpointIdOnRemoteChain),
    batchSizeLimit,
  );
  const txReceipt = await tx.wait();
  console.log("setBatchSizeLimit tx:", txReceipt?.hash);
}

async function main() {





  const proxyONFTContractAddressPath = path.join(__dirname, 'addresses', 'MyProxyONFT721.txt');
    const onftContractAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Shimmer.txt');

    const proxyONFTContractAddress = fs.readFileSync(proxyONFTContractAddressPath, 'utf8').trim();
    const onftContractAddress = fs.readFileSync(onftContractAddressPath, 'utf8').trim();



    const lzEndpointIdOnDestChain = 10230;

    const batchSizeLimit = "1";


  await setBatchSizeLimit(
    true,
    proxyONFTContractAddress,
    onftContractAddress,
    lzEndpointIdOnDestChain,
    batchSizeLimit,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});