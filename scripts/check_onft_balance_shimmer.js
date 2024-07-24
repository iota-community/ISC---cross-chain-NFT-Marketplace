const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Function to check balance
async function checkBalance(contractAddress, accountAddress) {
    const contract = await ethers.getContractAt("MyONFT721", contractAddress);
    const balance = await contract.balanceOf(accountAddress);

    //const owner = await contract.ownerOf("10");
    //console.log(`Owner of token 0 is: ${owner}`);
    return balance;
}

// Main function
async function main() {
    // Define paths to the files
    const contractAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Shimmer.txt');
    //const accountAddressPath = path.join(__dirname, 'accountAddress.txt');

    // Read the addresses from the files
    const contractAddress = fs.readFileSync(contractAddressPath, 'utf8').trim();
    const accountAddress = "0x7d0f6517DdF1D0F96a1050f1Dda7ee77323ceC0B";

    const balance = await checkBalance(contractAddress, accountAddress);
    console.log(`Balance of account ${accountAddress} is: ${balance.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });