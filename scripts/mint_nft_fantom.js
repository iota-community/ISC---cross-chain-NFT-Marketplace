const fs = require('fs');
const path = require('path');

async function createNFT(myERC721Address) {

    const MyERC721 = await ethers.getContractFactory("MyERC721");
    const myERC721 = MyERC721.attach(myERC721Address);

    const tx = await myERC721.mint();
    await tx.wait(); // Wait for the transaction to be mined


    // get the tokenId
    const tokenId = await myERC721._tokenId();
    console.log(`Minted NFT with tokenId ${tokenId}`);
}

async function main() {
    // Read the contract address from the file
    const addressPath = path.join(__dirname, 'addresses', 'MyERC721_FTM.txt');
    const myERC721Address = fs.readFileSync(addressPath, 'utf8').trim();

    await createNFT(myERC721Address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });