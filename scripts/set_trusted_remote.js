const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

const { pack } = require("@ethersproject/solidity");

// Function to set a trusted remote on the MyProxyONFT721 contract
async function setTrustedRemote(proxy_addr , trusted_remote, chainId) {
    // Attach to the deployed MyProxyONFT721 contract
    const MyProxyONFT721 = await ethers.getContractFactory("MyProxyONFT721");
    const myProxyONFT721 = MyProxyONFT721.attach(proxy_addr);

    // Call setTrustedRemote on the contract
    const tx = await myProxyONFT721.setTrustedRemote(chainId, trusted_remote);
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Set trusted remote for chainId ${chainId} to address ${trusted_remote}`);
}

// Example usage
async function main() {

    const proxyAddressPath = path.join(__dirname, 'addresses', 'MyProxyONFT721.txt');
    const myONFTAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Shimmer.txt');

    // Read the MyProxyONFT721 address from the file
    const myProxyONFT721Address = fs.readFileSync(proxyAddressPath, 'utf8').trim();
    // Read the MyONFT721 address from the file to use as the remoteAddress
    const remoteAddress = fs.readFileSync(myONFTAddressPath, 'utf8').trim();

    const chainId = 10230; 
   

    const trusted_remote = pack(["address", "address"], [remoteAddress, myProxyONFT721Address])

    await setTrustedRemote(myProxyONFT721Address ,trusted_remote, chainId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });