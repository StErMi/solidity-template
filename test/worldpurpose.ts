import {ethers, waffle} from 'hardhat';
import chai from 'chai';

import WorldPurposeArtifact from '../artifacts/contracts/WorldPurpose.sol/WorldPurpose.json';
import {WorldPurpose} from '../typechain/WorldPurpose';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';

const {deployContract} = waffle;
const {expect} = chai;

describe('WorldPurpose Contract', () => {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  let worldPurpose: WorldPurpose;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    worldPurpose = (await deployContract(owner, WorldPurposeArtifact)) as WorldPurpose;
  });

  describe('Test setPurpose', () => {
    it("set purpose success when there's no purpose", async () => {
      const purposeTitle = 'Reduce the ETH fee cost in the next 3 months';
      const purposeInvestment = ethers.utils.parseEther('0.1');
      await worldPurpose.connect(addr1).setPurpose(purposeTitle, {
        value: purposeInvestment,
      });

      // Chdck that the purpose has been set
      const currentPurpose = await worldPurpose.getCurrentPurpose();
      expect(currentPurpose.purpose).to.equal(purposeTitle);
      expect(currentPurpose.owner).to.equal(addr1.address);
      expect(currentPurpose.investment).to.equal(purposeInvestment);

      // Check that the balance has been updated
      const balance = await worldPurpose.connect(addr1).getBalance();
      expect(balance).to.equal(purposeInvestment);
    });

    it('override the prev purpose', async () => {
      await worldPurpose.connect(addr2).setPurpose("I'm the old world purpose", {
        value: ethers.utils.parseEther('0.1'),
      });

      const purposeTitle = "I'm the new world purpose!";
      const purposeInvestment = ethers.utils.parseEther('0.11');
      await worldPurpose.connect(addr1).setPurpose(purposeTitle, {
        value: purposeInvestment,
      });

      // Chdck that the purpose has been set
      const currentPurpose = await worldPurpose.getCurrentPurpose();
      expect(currentPurpose.purpose).to.equal(purposeTitle);
      expect(currentPurpose.owner).to.equal(addr1.address);
      expect(currentPurpose.investment).to.equal(purposeInvestment);

      // Check that the balance has been updated
      const balance = await worldPurpose.connect(addr1).getBalance();
      expect(balance).to.equal(purposeInvestment);
    });

    it('Check PurposeChange event is emitted ', async () => {
      const purposeTitle = "I'm the new world purpose!";
      const purposeInvestment = ethers.utils.parseEther('0.11');
      const tx = await worldPurpose.connect(addr1).setPurpose(purposeTitle, {
        value: purposeInvestment,
      });

      await expect(tx).to.emit(worldPurpose, 'PurposeChange').withArgs(addr1.address, purposeTitle, purposeInvestment);
    });

    it("You can't override your own purpose", async () => {
      await worldPurpose.connect(addr1).setPurpose("I'm the new world purpose!", {
        value: ethers.utils.parseEther('0.10'),
      });

      const tx = worldPurpose.connect(addr1).setPurpose('I want to override the my own purpose!', {
        value: ethers.utils.parseEther('0.11'),
      });

      await expect(tx).to.be.revertedWith('You cannot override your own purpose');
    });

    it('Investment needs to be greater than 0', async () => {
      const tx = worldPurpose.connect(addr1).setPurpose('I would like to pay nothing to set a purpose, can I?', {
        value: ethers.utils.parseEther('0'),
      });

      await expect(tx).to.be.revertedWith('You need to invest more than the previous purpose owner');
    });

    it('Purpose message must be not empty', async () => {
      const tx = worldPurpose.connect(addr1).setPurpose('', {
        value: ethers.utils.parseEther('0.1'),
      });

      await expect(tx).to.be.revertedWith('You need to set a purpose message');
    });

    it('New purpose investment needs to be greater than the previous one', async () => {
      await worldPurpose.connect(addr1).setPurpose("I'm the old purpose!", {
        value: ethers.utils.parseEther('0.10'),
      });

      const tx = worldPurpose
        .connect(addr2)
        .setPurpose('I want to pay less than the previous owner of the purpose, can I?', {
          value: ethers.utils.parseEther('0.01'),
        });

      await expect(tx).to.be.revertedWith('You need to invest more than the previous purpose owner');
    });
  });

  describe('Test withdraw', () => {
    it('Withdraw your previous investment', async () => {
      const firstInvestment = ethers.utils.parseEther('0.10');
      await worldPurpose.connect(addr1).setPurpose('First purpose', {
        value: ethers.utils.parseEther('0.10'),
      });

      await worldPurpose.connect(addr2).setPurpose('Second purpose', {
        value: ethers.utils.parseEther('0.11'),
      });

      const tx = await worldPurpose.connect(addr1).withdraw();

      // Check that my current balance on contract is 0
      const balance = await worldPurpose.connect(addr1).getBalance();
      expect(balance).to.equal(0);

      // Check that I got back in my wallet the whole import
      await expect(tx).to.changeEtherBalance(addr1, firstInvestment);
    });

    it('Withdraw only the unlocked investment', async () => {
      const firstInvestment = ethers.utils.parseEther('0.10');
      await worldPurpose.connect(addr1).setPurpose('First purpose', {
        value: ethers.utils.parseEther('0.10'),
      });

      await worldPurpose.connect(addr2).setPurpose('Second purpose', {
        value: ethers.utils.parseEther('0.11'),
      });

      const secondInvestment = ethers.utils.parseEther('0.2');
      await worldPurpose.connect(addr1).setPurpose('Third purpose from the first addr1', {
        value: secondInvestment,
      });

      const tx = await worldPurpose.connect(addr1).withdraw();

      // In this case the user can Withdraw only it's first investment
      // The second one is still "locked" because he's the owner of the current purpose

      // Check that my current balance on contract is 0
      const balance = await worldPurpose.connect(addr1).getBalance();
      expect(balance).to.equal(secondInvestment);

      // Check that I got back in my wallet the whole import
      await expect(tx).to.changeEtherBalance(addr1, firstInvestment);
    });

    it('You cant withdraw when your balance is empty', async () => {
      const tx = worldPurpose.connect(addr1).withdraw();

      await expect(tx).to.be.revertedWith("You don't have enough withdrawable balance");
    });

    it('Withdraw only the unlocked investment', async () => {
      await worldPurpose.connect(addr1).setPurpose('First purpose', {
        value: ethers.utils.parseEther('0.10'),
      });

      const tx = worldPurpose.connect(addr1).withdraw();

      // Your funds are still "locked" because your are the owner of the current purpose
      await expect(tx).to.be.revertedWith("You don't have enough withdrawable balance");
    });
  });
});
