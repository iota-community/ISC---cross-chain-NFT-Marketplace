const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function deployCrossChainToken(lzEndpointAddress) {
    const MyCrossChainToken = await ethers.getContractFactory("CrossChainToken");
    const myCrossChainToken = await MyCrossChainToken.deploy(lzEndpointAddress);

    await myCrossChainToken.waitForDeployment();

    const address = await myCrossChainToken.getAddress();
    console.log("MyCrossChainToken deployed to:", address);
    return address;
}

async function main() {
    const lzEndpointAddress = "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1"; // Endpoint on Binance Smart Chain
    
    const deployedAddress = await deployCrossChainToken(lzEndpointAddress);

    // Save the contract address to a file for easy access
    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true });

    const filePath = path.join(addressDirectory, 'CrossChainToken_BNB.txt');
    fs.writeFileSync(filePath, deployedAddress);

    console.log(`Contract address written to ${filePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });