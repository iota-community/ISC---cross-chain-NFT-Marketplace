async function main() {
    const Counter = await ethers.getContractFactory("NFTMarketplace");
    const counter = await Counter.deploy();

    console.log("NFTMarketPlace deployed to:", await counter.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });