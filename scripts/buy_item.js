const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function buyItem(marketplaceAddress, nftAddress, tokenId) {
    // Attach to the deployed NFTMarketPlace contract
    const NFTMarketPlace = await ethers.getContractFactory("NFTMarketPlace");
    const marketplace = await NFTMarketPlace.attach(marketplaceAddress);

    // Call the buyItem function
    const tx = await marketplace.buyItem(nftAddress, tokenId, { value: 1 }); // Assuming 1 ETH as payment, adjust accordingly
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Bought item with tokenId ${tokenId} from ${nftAddress}`);
}

async function main() {
    // Load the marketplace address
    const marketplaceAddressPath = path.join(__dirname, 'addresses', 'NFTMarketplace.txt');
    const marketplaceAddress = fs.readFileSync(marketplaceAddressPath, 'utf8').trim();

    // Load the NFT contract address (assuming you're buying an NFT from MyERC721 contract)
    const nftAddressPath = path.join(__dirname, 'addresses', 'MyERC721.txt');
    const nftAddress = fs.readFileSync(nftAddressPath, 'utf8').trim();

    // Specify the tokenId of the NFT you want to buy
    const tokenId = 0; // Example token ID, change this to the actual token ID you want to buy

    await buyItem(marketplaceAddress, nftAddress, tokenId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });