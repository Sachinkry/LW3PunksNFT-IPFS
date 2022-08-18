const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // URL from where we extract metadata for LW3Punks token
  const metadataURL = "ipfs://QmZwpDrHK3eAt7vaTuu4n4Z8RPXMVDbZkK2Y3gqq1xQ12C";

  const lw3PunksContract = await ethers.getContractFactory("LW3Punks");

  const deployedLW3PunksContract = await lw3PunksContract.deploy(metadataURL);

  await deployedLW3PunksContract.deployed();

  // print the address of the LW3Punks contract
  console.log(
    "LW3Punks Contract Address: ",
    deployedLW3PunksContract.address
  );
}

// call the main function and catch if there's any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })