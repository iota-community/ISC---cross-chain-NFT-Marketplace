const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function deployMyONFT721(name, symbol, minGasToTransfer,lzEndpointAddress) {
    const MyONFT = await ethers.getContractFactory("MyONFT721");
    const myONFT = await MyONFT.deploy(name, symbol, minGasToTransfer,lzEndpointAddress);

    const address = await myONFT.getAddress();
    console.log("MyONFT721 deployed to:", address);
    return address;
}

async function main() {
    const minGasToTransfer = 100000;
    const lzEndpointAddress = "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1"; // Endpoint on Binance Smart Chain

    const name = "SampleToken";
    const symbol = "SESA";
    
    const deployedAddress = await deployMyONFT721(name, symbol, minGasToTransfer, lzEndpointAddress);

    // Save the contract address to a file for easy access
    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true });

    const filePath = path.join(addressDirectory, 'MyONFT721_Bnb.txt');
    fs.writeFileSync(filePath, deployedAddress);

    console.log(`Contract address written to ${filePath}`);
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });