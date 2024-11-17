// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });


const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions", function () {
  let Transactions, transactions, owner, addr1;

  beforeEach(async function () {
    Transactions = await ethers.getContractFactory("Transactions");
    transactions = await Transactions.deploy();
    await transactions.deployed();

    [owner, addr1] = await ethers.getSigners();
  });

  it("Should add a transaction to the blockchain", async function () {
    const initialCount = await transactions.getTransactionCount();
    expect(initialCount).to.equal(0);

    await transactions.addToBlockchain(addr1.address, 100, "Test Message", "Keyword1");

    const updatedCount = await transactions.getTransactionCount();
    expect(updatedCount).to.equal(1);

    const allTransactions = await transactions.getAllTransactions();
    expect(allTransactions.length).to.equal(1);
    expect(allTransactions[0].amount).to.equal(100);
    expect(allTransactions[0].message).to.equal("Test Message");
  });

  it("Should emit a Transfer event when a transaction is added", async function () {
    await expect(transactions.addToBlockchain(addr1.address, 100, "Test Message", "Keyword1"))
      .to.emit(transactions, "Transfer")
      .withArgs(owner.address, addr1.address, 100, "Test Message", 123, "Keyword1");
  });
});
