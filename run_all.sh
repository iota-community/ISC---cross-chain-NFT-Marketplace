

npx hardhat compile

npx hardhat run scripts/deploy_oft_shimmer.js  --network shimmerevm-testnet
npx hardhat run scripts/deploy_oft_bnb.js --network bnbTestnet

# wait for the transaction to be mined
sleep 30

npx hardhat run scripts/set_trusted_remote_oft_bnb.js --network bnbTestnet
npx hardhat run scripts/set_trusted_remote_oft_shimmer.js  --network shimmerevm-testnet

sleep 30

npx hardhat run scripts/configure_oft_bnb.js  --network bnbTestnet
npx hardhat run scripts/send_oft.js  --network bnbTestnet