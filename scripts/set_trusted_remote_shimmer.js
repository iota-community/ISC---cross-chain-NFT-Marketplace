const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

// Function to set a trusted remote on the MyProxyONFT721 contract
async function setTrustedRemote(proxy_addr ,myONFT721Address, chainId) {
    // Attach to the deployed MyProxyONFT721 contract
    //const MyProxyONFT721 = await ethers.getContractFactory("MyProxyONFT721");
    //const myProxyONFT721 = MyProxyONFT721.attach(proxy_addr);

    const MyONFT721 = await ethers.getContractFactory("MyONFT721");
    const myONFT721 = MyONFT721.attach(myONFT721Address);

    // Call setTrustedRemote on the contract
    const tx = await myONFT721.setTrustedmyONFT721Address(chainId, proxy_addr);
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Set trusted remote for chainId ${chainId} to address ${myONFT721Address}`);
}

// Example usage
async function main() {

    const proxyAddressPath = path.join(__dirname, 'addresses', 'MyProxyONFT721.txt');
    const myONFTAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Shimmer.txt');

    // Read the MyProxyONFT721 address from the file
    const myProxyONFT721Address = fs.readFileSync(proxyAddressPath, 'utf8').trim();
    // Read the MyONFT721 address from the file to use as the myONFT721Address
    const myONFT721Address = fs.readFileSync(myONFTAddressPath, 'utf8').trim();

    const chainId = 10102; 

    await setTrustedRemote(myProxyONFT721Address,myONFT721Address, chainId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });