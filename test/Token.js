const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract("Token");

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await ethers.deployContract("Token");

    // Transfer 50 tokens from owner to addr1
    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);

    // Transfer 50 tokens from addr1 to addr2
    await token.connect(addr1).transfer(addr2.address, 50);
    expect(await token.balanceOf(addr2.address)).to.equal(50);
  });

  it("Should fail if sender doesn't have enough tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const token = await ethers.deployContract("Token");

    const initialOwnerBalance = await token.balanceOf(owner.address);

    // Try to send 1 token from addr1 (0 tokens) to owner
    await expect(
      token.connect(addr1).transfer(owner.address, 1)
    ).to.be.revertedWith("Not enough tokens");

    // Owner balance shouldn't have changed
    expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });
});
