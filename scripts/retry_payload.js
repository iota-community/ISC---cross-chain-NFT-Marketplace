const fs = require('fs');
const path = require('path');
const { pack } = require("@ethersproject/solidity");


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



    let source_app = "0x6911a9df536ba3d446dac0d98ddcf154ef870e0c"
    let dest_app = "0xbe569d60a59723d220aff448ad51319c315ead35"

    let trustedRemote = pack(
        ['address', 'address'],
        [dest_app, source_app],
      );

    console.log(trustedRemote);



    await retryPayload(myERC721Address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });