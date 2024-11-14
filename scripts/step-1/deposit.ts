import hre from "hardhat";
import { Toolog } from "toolog";
import { SafeVault } from "../../typechain-types";

const logger = new Toolog("hello-venn");

const SAFE_VAULT_ADDRESS = require('../../venn.config.json')?.networks?.holesky?.contracts?.SafeVault;

async function main() {
    if (!SAFE_VAULT_ADDRESS) {
        logger.error("SafeVault address not found in venn.config.json");
        logger.warn("[hint] run `npm run step:1:deploy` to deploy SafeVault, then try again");
        return;
    }

    logger.info("Depositing To SafeVault");

    const [owner] = await hre.ethers.getSigners();
    logger.warn(` -> Owner address: ${owner.address}`);

    const ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    logger.warn(` -> Owner balance: ${hre.ethers.formatEther(ownerBalance)} ETH\n`);

    const SafeVault = await hre.ethers.getContractFactory("SafeVault");
    const safeVault = await SafeVault.attach(SAFE_VAULT_ADDRESS) as SafeVault;
    logger.warn(` -> SafeVault address: ${await safeVault.getAddress()}`);

    const depositAmount = hre.ethers.parseEther("0.0001");
    logger.warn(` -> Depositing ${hre.ethers.formatEther(depositAmount)} ETH to SafeVault`);

    const tx = await safeVault.deposit({ value: depositAmount });
    
    const waitBlocks = ["localhost", "local", "hardhat", "anvil"].includes(hre.network.name) ? 1 : 3;
    await tx.wait(waitBlocks);
    logger.warn(` -> Transaction hash: ${tx.hash}`);
    
    logger.ok();
    logger.done("All done!");
}


main().catch(console.error);