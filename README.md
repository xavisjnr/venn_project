# 👋 Hello Venn

Welcome, fellow builder!  
This repo serves as a "Hello World" to get you up & running with Venn like a pro in 10m or less! 🏆

## SafeVault.sol

Our contract is a (very) simple **[SafeVault.sol](contracts/SafeVault.sol)** with the following interface:

- **`deposits`**
  a mapping between a user's address and how much ETH they have <br /><br />

- **`deposit()`**
  a method for users to deposit ETH to the vault <br /><br />

- **`withdraw()`**
  a method for users to withdraw previously deposited ETH <br /><br />

## Step 0 / Setup

Let's make sure everything works as-is before we start to tinker with this project:

1. **Clone the Repo** 🖥️  

   ```bash
   git clone git@github.com:ironblocks/hello-venn.git
   cd hello-venn
   ```

   <br />

2. **Install Dependencies** 📦  

   ```bash
   npm install
   ```

   <br />

3. **Setup Environment Variables** 🔑  
   Copy the `.env.example` file to `.env` and set the values:

   ```bash
   cp .env.example .env
   ```

   Make sure to set the following environment variables:
   - **`PRIVATE_KEY`**
      the key you will use for deploying this contract <br /><br />

   - **`HOLESKY_RPC_URL`**
      the RPC URL to connect to Holesky <br /><br />

   - **`VENN_PRIVATE_KEY`**
      used by the `venn-cli` to send Venn setup transactions. Usually, this would be the same as your **`PRIVATE_KEY`** <br /><br /><br />

4. **Run Tests** 🧪

   ```bash
   npm test
   ```

   All tests pass, and we can continue to the next step.
   <br /><br />

## Step 1 / Getting to `Venn Ready`

We're going to use the `venn-cli` to integrate Venn into our smart contracts. This will update our smart contracts, making them **`Venn Ready`**, without changing their existing behavior until we actually enable Venn in **Step 2 / From `Venn Ready` To `Venn Enabled`** below.

1. **Install Venn CLI** 📦  

   ```bash
   npm i -g @vennbuild/cli
   ```

   <br />

2. **Run the CLI on our contracts** 🛠️  

   ```bash
   venn fw integ -d contracts
   ```

   <br />

3. **Review Changes to `SafeVault.sol`** 🔎  

   - An import for **`VennFirewallConsumer`** was added
   - The contract now inherits the **`VennFirewallConsumer`**
   - External methods are now **`firewallProtected`**

   <br />

4. **Verify Tests Still Pass** 🧪

   ```bash
   npm test
   ```

   <br />

5. **Deploy** 🚀

   ```bash
   npm run step:1:deploy
   ```

   <br />

6. **End 2 End Tests** ☘️

   ```bash
   npm run step:1:deposit
   npm run step:1:withdraw
   ```

   Now that our contracts are **`Venn Ready`**, let's move on to making them **`Venn Enabled`**.

   <br />

## Step 2 / From `Venn Ready` To `Venn Enabled`

We'll use the `venn-cli` to enable Venn's security features on our smart contracts:

1. **Enable Venn** 🛡️  

   ```bash
   venn enable --network holesky
   ```

   Our **`SafeVault`** is now protected by Venn.

   <br />

2. **Venn Policy Address** 📌

   The CLI also prints out the address of our new `Venn Policy`
   ![Venn Policy](https://storage.googleapis.com/venn-engineering/venn-cli/venn-policy.png) <br />
   We'll need it in the next step, so go ahead and copy it into the **`venn.config.json`** file as follows:

   ```json
   {
      "networks": {
         "holesky": {
               "contracts": {
                  "SafeVault": "..."
               },
               "policyAddress": "PASTE YOUR POLICY ADDRESS HERE"
         }
      }
   }
   ```

   <br />

3. **But Now Everything's Broken** 😱  

   If we now try to deposit or withdraw, our transactions will fail

   ```bash
   npm run step:2:deposit
   npm run step:2:withdraw
   ```

   This is because Venn only allows approved transactions to go through.  
   So, how do we get our transactions approved by Venn?
   <br />

   > **TIP:** *See these **`Firewall Reverted`** transactions on the [Venn Explorer](https://explorer.venn.build)*

   <br />

## Step 3 / `Venn Approved` Transactions

Let's use the Venn DApp SDK so that we can get our transactions approved:

1. **Install The SDK** 📦  

   ```bash
   npm i @vennbuild/venn-dapp-sdk
   ```

   <br />

2. **Review The SDK Code** 🖥️  

   For the purpose of this guide, we took the liberty of preparing all the code in advance, so you don't have to. <br /><br />

   Checkout the integration code in the file **[step-3/deposit.ts](scripts/step-3/deposit.ts)**:

   ```typescript
   const vennClient = new VennClient({
        vennURL: VENN_SIGNER_URL,
        vennPolicyAddress: VENN_POLICY_ADDRESS
   });

   ...

   const approvedTx = await vennClient.approve({
      from: owner.address,
      to: SAFE_VAULT_ADDRESS,
      value: hre.ethers.parseEther("0.0001").toString(),
      data: safeVault.interface.encodeFunctionData("deposit")
   });
   ```

   <br />

3. **Run Approved Transactions** 📦  

   With the Venn DApp SDK installed, our updated **`deposit`** and **`withdraw`** scripts are now working again: <br /><br />

   ```bash
   npm run step:3:deposit
   npm run step:3:withdraw
   ```

   <br />

   > **TIP:** *See these transactions on the [Venn Explorer](https://explorer.venn.build)*

   <br />

## Bonus Round

- Checkout **[Venn Playground](https://playground.venn.build)** for a live version of the **`SafeVault`** Hello Venn DApp <br />

- Use the **[Venn Explorer](https://explorer.venn.build)** to ... well, explore :)
