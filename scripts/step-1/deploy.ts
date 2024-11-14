import hre from "hardhat";
import * as fs from "fs/promises";
import { Toolog } from "toolog";

const logger = new Toolog("hello-venn");

async function main() {
    logger.info("Deploying SafeVault");

    const [owner] = await hre.ethers.getSigners();
    logger.warn(` -> Owner address: ${owner.address}`);

    const ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    logger.warn(` -> Owner balance: ${hre.ethers.formatEther(ownerBalance)} ETH\n`);

    logger.warn(' -> Deploying ...');
    const SafeVault = await hre.ethers.getContractFactory("SafeVault");
    const safeVault = await SafeVault.deploy();
    
    const waitBlocks = ["localhost", "local", "hardhat", "anvil"].includes(hre.network.name) ? 1 : 3;
    await safeVault.deploymentTransaction()?.wait(waitBlocks);

    logger.warn(` -> SafeVault address: ${await safeVault.getAddress()}`);
    logger.warn(` -> Transaction hash: ${safeVault.deploymentTransaction()?.hash}\n`);
    
    logger.warn(' -> Writing contract address to venn.config.json');
    const config = {
        networks: {
            holesky: {
                contracts: {
                    SafeVault: await safeVault.getAddress()
                },
                policyAddress: "PASTE YOUR POLICY ADDRESS HERE"
            }
        }
    };
    await fs.writeFile("venn.config.json", JSON.stringify(config, null, 4));
    logger.ok();

    logger.done("All done!");
}


main().catch(console.error);