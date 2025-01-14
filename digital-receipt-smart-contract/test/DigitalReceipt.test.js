const { expect } = require('chai');
const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;


describe('DigitalReceipt', function () {
  beforeEach(async function () {
    this.ERC721 = await ethers.getContractFactory('DigitalReceipt');
    this.erc721 = await this.ERC721.deploy("something");
    await this.erc721.deployed();
  });

  context('mints', async function () {
    beforeEach(async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      this.owner = owner;
      this.owneraddress = await this.owner.getAddress();
      this.addr1 = addr1;
      this.addr1address = await this.addr1.getAddress();
      this.addr2 = addr2;
    });

    describe('mint', function () {
      it('successfully mints a single token as owner', async function () {
        const mintTx = await this.erc721.connect(this.owner).mint();
        await expect(mintTx)
          .to.emit(this.erc721, 'Transfer')
          .withArgs(ZERO_ADDRESS, this.owneraddress, 1);
        expect(await this.erc721.ownerOf(1)).to.equal(this.owneraddress);

        await ethers.provider.waitForTransaction(mintTx.hash);
        const receipt = await ethers.provider.getTransactionReceipt(mintTx.hash);
        //console.log(receipt);

      });

      it('successfully mints a single token', async function () {
        const mintTx = await this.erc721.connect(this.addr1).mint()
        await expect(mintTx)
          .to.emit(this.erc721, 'Transfer')
          .withArgs(ZERO_ADDRESS, this.addr1address, 1);
        expect(await this.erc721.ownerOf(1)).to.equal(this.addr1address);

        await ethers.provider.waitForTransaction(mintTx.hash);
        const receipt = await ethers.provider.getTransactionReceipt(mintTx.hash);
        //console.log(receipt);

      });

      it('fails to withdraw if not owner', async function () {
        await expect(
          this.erc721.connect(this.addr1).withdraw()
        ).to.be.revertedWith('Ownable: caller is not the owner');
      });

    });
  });

  context('misc non minting functions', async function () {
    beforeEach(async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      this.owner = owner;
      this.owneraddress = await this.owner.getAddress();
      this.addr1 = addr1;
      this.addr1address = await this.addr1.getAddress();
      this.addr2 = addr2;
      await this.erc721.connect(this.owner).mint();
    });

    describe('token URI', function () {
      it('shows the not revealed location by default', async function () {
        await this.erc721.connect(this.owner).setBaseURI("baseuri/");
        await expect(await this.erc721.tokenURI(1))
          .to.equal("baseuri/1.json");
      });
    });
  });

});
