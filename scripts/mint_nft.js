const fs = require('fs');
const path = require('path');

async function createNFT(marketplaceAddress, tokenURI, price, chain) {
    const [deployer] = await ethers.getSigners();
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = NFTMarketplace.attach(marketplaceAddress);

    const tx = await marketplace.createToken(tokenURI, 1, chain);
    const receipt = await tx.wait(); // Wait for the transaction to be mined
    console.log(receipt.events);
    console.log(receipt.logs[receipt.logs.length - 1])

    // Log the events
    for (const event of receipt.logs) {
        console.log(`Event ${event} with args ${event.args}`);
    }
    console.log(`NFT created with tokenURI: ${tokenURI}`);
}

async function main() {
    // Read the contract address from the file
    const addressPath = path.join(__dirname, 'addresses', 'NFTMarketplace.txt');
    const marketplaceAddress = fs.readFileSync(addressPath, 'utf8').trim();

    await createNFT(marketplaceAddress, "ipfs://exampleTokenURI", "0.1", 1); // 0 represents the first value in the Chain enum, adjust accordingly
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });