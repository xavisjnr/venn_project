import hre from "hardhat";
import { expect } from "chai";


describe("SafeVault", function () {
  let safeVault:any, user:any;

  beforeEach(async () => {
    [user] = await hre.ethers.getSigners();

    const SafeVault = await hre.ethers.getContractFactory("SafeVault");
    safeVault = await SafeVault.deploy();
  });

  it("user can deposit", async function () {
    // Arrange
    const depositAmount = hre.ethers.parseEther("0.0001");

    // Act
    await safeVault.connect(user).deposit({ value: depositAmount });

    // Assert
    const userDeposits = await safeVault.deposits(user.address);
    expect(userDeposits).to.equal(depositAmount);
  });

  it("user can withdraw", async function () {
    // Arrange
    const depositAmount = hre.ethers.parseEther("0.0001");
    await safeVault.connect(user).deposit({ value: depositAmount });

    // Act
    await safeVault.connect(user).withdraw(depositAmount);

    // Assert
    const userDeposits = await safeVault.deposits(user.address);
    expect(userDeposits).to.equal(0);
  });
});
