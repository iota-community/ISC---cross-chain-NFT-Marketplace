const fs = require('fs');
const path = require('path');

async function retryPayload(myERC721Address) {

    const MyERC721 = await ethers.getContractFactory("MyERC721");
    const myERC721 = MyERC721.attach(myERC721Address);

    const tx = await myERC721.mint();
    await tx.wait(); // Wait for the transaction to be mined
}

async function main() {
    // Read the contract address from the file
   

    let dest_chain_addr = "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1"

    let endpoint = await ethers.getContract("dest_chain_addr");

    let trustedRemote = hre.ethers.utils.solidityPack(
        ['address', 'address'],
        [remoteContract.address, localContract.address],
      );



    await retryPayload(myERC721Address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });