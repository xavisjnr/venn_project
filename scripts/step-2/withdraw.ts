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

    logger.info("Withdrawing From SafeVault");

    const [owner] = await hre.ethers.getSigners();
    logger.warn(` -> Owner address: ${owner.address}`);

    const ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    logger.warn(` -> Owner balance: ${hre.ethers.formatEther(ownerBalance)} ETH\n`);

    const SafeVault = await hre.ethers.getContractFactory("SafeVault");
    const safeVault = await SafeVault.attach(SAFE_VAULT_ADDRESS) as SafeVault;
    logger.warn(` -> SafeVault address: ${await safeVault.getAddress()}`);

    const withdrawalAmount = hre.ethers.parseEther("0.0001");
    logger.warn(` -> Withdrawing ${hre.ethers.formatEther(withdrawalAmount)} ETH from SafeVault`);

    const tx = await safeVault.withdraw(withdrawalAmount, {
        gasLimit: 600000,
        gasPrice: 3000000000
    });

    try {
        await tx.wait(1);
    }
    catch (e) {
        logger.warn(` -> Transaction hash: ${tx.hash}`);
        logger.error(` -> ${(e as any).shortMessage}\n`);
        logger.done(` -> Wait, is that Venn blocking unapproved transactions!?  Niiicee! 😎\n`);
    }
}


main().catch(console.error);