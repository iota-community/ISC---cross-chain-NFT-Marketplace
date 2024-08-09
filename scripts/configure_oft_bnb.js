// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {

 //const myTokenAddress = "0xC5Df740512d04e885fc245cb33E39208b17fC78e";
  // "PASTE BAOBAB DEPLOYED CONTRACT ADDRESS HERE";

  // read the contract address from the file

  const tokenAddressPath = path.join(__dirname, 'addresses', 'CrossChainToken_BNB.txt');
  const myTokenAddress = fs.readFileSync(tokenAddressPath, 'utf8').trim();
  


  const crosschainTokenSRC = await hre.ethers.getContractAt(
    "CrossChainToken",
    myTokenAddress
  );

  // approve src contract to spend a number of tokens (100 CCT tokens)

  console.log(`Approving.....`);
  let tx_app = await crosschainTokenSRC.approve(
    myTokenAddress,
    "100000000000000000000"
  );
  await tx_app.wait();
  console.log(`Done approving.....`);
  // get the transaction hash
  

  // Set minDstGas on source chain
  // accepts the following: 1) dest chainId 2) packet type ("0" meaning send) 3) gas limit amount 

  console.log(`Setting minDstGas`);
  let set_min_dist = await crosschainTokenSRC.setMinDstGas(10230, 0, 200000);
  await set_min_dist.wait();
  console.log(`Done setting minDstGas`);

  // Set setUseCustomAdapterParams to true

  console.log(`Setting CustomAdapterParams`);
  let res = await crosschainTokenSRC.setUseCustomAdapterParams(true, );
  await res.wait();

  console.log(`Done setting CustomAdapterParams`);

  // Execute the estimateSendFee function

  console.log(`Estimating fee`);
  const tx = await crosschainTokenSRC.estimateSendFee(
    10230,
    "0x7d0f6517DdF1D0F96a1050f1Dda7ee77323ceC0B",
    "10000000000000000000",
    false,
    "0x00010000000000000000000000000000000000000000000000000000000000030d40"
  );
  console.log(`Estimated gas fee is: ${Number(tx[0])}`);
  const nativeFee = tx[0];
  console.log(`Done estimating fee`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run scripts/misc.js --network baobab