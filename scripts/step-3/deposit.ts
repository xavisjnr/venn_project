import hre from "hardhat";
import { Toolog } from "toolog";
import { SafeVault } from "../../typechain-types";
import { VennClient } from "@vennbuild/venn-dapp-sdk";

const logger = new Toolog("hello-venn");

const VENN_SIGNER_URL = 'https://signer2.testnet.venn.build/api/17000/sign'
const SAFE_VAULT_ADDRESS = require('../../venn.config.json')?.networks?.holesky?.contracts?.SafeVault;
const VENN_POLICY_ADDRESS = require('../../venn.config.json')?.networks?.holesky?.policyAddress;

async function main() {
    if (!SAFE_VAULT_ADDRESS) {
        logger.error("SafeVault address not found in venn.config.json");
        logger.warn("[hint] run `npm run step:1:deploy` to deploy SafeVault, then try again");
        return;
    }

    if (!VENN_POLICY_ADDRESS) {
        logger.error("Policy address not found in venn.config.json");
        logger.warn("[hint] did you run `venn enable --holesky` and copy the policy address?");
        return;
    }

    const [owner] = await hre.ethers.getSigners();

    logger.info("Approving transaction via the Venn DApp SDK");
    const vennClient = new VennClient({
        vennURL: VENN_SIGNER_URL,
        vennPolicyAddress: VENN_POLICY_ADDRESS
    });

    const SafeVault = await hre.ethers.getContractFactory("SafeVault");
    const safeVault = await SafeVault.attach(SAFE_VAULT_ADDRESS) as SafeVault;

    const approvedTx = await vennClient.approve({
        from: owner.address,
        to: SAFE_VAULT_ADDRESS,
        value: hre.ethers.parseEther("0.0001").toString(),
        data: safeVault.interface.encodeFunctionData("deposit")
    });
    logger.done(" -> Venn Approved the transaction");
    logger.ok();

    logger.info("Depositing To SafeVault");
    logger.warn(` -> Owner address: ${owner.address}`);

    const ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    logger.warn(` -> Owner balance: ${hre.ethers.formatEther(ownerBalance)} ETH\n`);

    const depositAmount = hre.ethers.parseEther("0.0001");
    logger.warn(` -> Depositing ${hre.ethers.formatEther(depositAmount)} ETH to SafeVault`);

    const tx = await owner.sendTransaction(approvedTx as any);
    await tx.wait(3);
    logger.warn(` -> Transaction hash: ${tx.hash}`);
    logger.ok();

    logger.done("All done!");
}


main().catch(console.error);