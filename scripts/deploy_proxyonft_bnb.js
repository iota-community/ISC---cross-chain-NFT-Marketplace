const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function deployMyProxyONFT721(minGasToTransfer, lzEndpointAddress, proxyTokenAddress) {
    const MyProxyONFT721 = await ethers.getContractFactory("MyProxyONFT721");
    const myProxyONFT721 = await MyProxyONFT721.deploy(minGasToTransfer, lzEndpointAddress, proxyTokenAddress);
    //await myProxyONFT721.deployed();

    const address = await myProxyONFT721.getAddress();
    console.log("MyProxyONFT721 deployed to:", address);
    return address;
}

async function main() {
    const minGasToTransfer = 100000; // Example value, adjust based on your needs
    const lzEndpointAddress = "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1"; 

    // Read the proxyTokenAddress from the file
    const proxyTokenAddressPath = path.join(__dirname, 'addresses', 'MyERC721_BNB.txt');
    const proxyTokenAddress = fs.readFileSync(proxyTokenAddressPath, 'utf8').trim();

    const deployedAddress = await deployMyProxyONFT721(minGasToTransfer, lzEndpointAddress, proxyTokenAddress);

    // Save the contract address to a file for easy access
    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true });

    const filePath = path.join(addressDirectory, 'MyProxyONFT721.txt');
    fs.writeFileSync(filePath, deployedAddress);

    console.log(`Contract address written to ${filePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });