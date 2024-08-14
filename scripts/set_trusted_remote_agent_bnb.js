const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');


// Function to set a trusted remote on the MyToken contract
async function setTrustedRemote(myTokenAddress,remoteAddress, chainId) {
    // Attach to the deployed MyToken contract
    const MyToken = await ethers.getContractFactory("CrossChainToken");
    const myToken = MyToken.attach(myTokenAddress);

    // Call setTrustedRemote on the contract
    const tx = await myToken.setTrustedRemoteAddress(chainId, remoteAddress);
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Set trusted remote for chainId ${chainId} to address ${remoteAddress}`);
}

// Example usage
async function main() {

    const tokenAddressPath = path.join(__dirname, 'addresses', 'Messanger_bnb.txt');
    const myTokenAddress = fs.readFileSync(tokenAddressPath, 'utf8').trim();

    const tokenShimmerPath = path.join(__dirname, 'addresses', 'Messanger_shimmer.txt');
    const remoteAddress = fs.readFileSync(tokenShimmerPath, 'utf8').trim();

    const chainId = 10230; 

    await setTrustedRemote(myTokenAddress,remoteAddress, chainId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });