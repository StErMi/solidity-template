# 🛠️ solidity-template

> **TLDR;** pre-configured hardhat project to run, debug, test and deploy your next solidity smart contract.
>
> This project should be your personal and always reliable swiss knife available in your pocket when you need to create a new Solidity project to be released on the Ethereum Blockchain.

📚 Do you need a more ** detailed explanation**? Just check out my blog post ["How to deploy your first smart contract on Ethereum with Solidity and Hardhat"](https://stermi.medium.com/how-to-deploy-your-first-smart-contract-on-ethereum-with-solidity-and-hardhat-22f21d31096e) where I explain how to build this solidity-template from 0.

## What is inside?

- Example of well-made Solidity Contract
- Example of a well-made test suite for your Solidity Contract
- Pre-configured Hardhat project
- Automatically generate TypeScript bindings

## Hardhat plugins included

- [hardhat-ethers](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html): injects `ethers.js` into the Hardhat Runtime Environment
- [hardhat-waffle](https://hardhat.org/plugins/nomiclabs-hardhat-waffle.html): adds a Waffle-compatible provider to the Hardhat Runtime Environment and automatically initializes the Waffle Chai matchers
- [TypeChain](https://hardhat.org/plugins/typechain-hardhat.html): automatically generate TypeScript bindings for smartcontracts
- [hardhat-solhint](https://hardhat.org/plugins/nomiclabs-hardhat-solhint.html): easily run solhint to lint your Solidity code
- [hardhat-etherscan](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html): automatically verify contracts on Etherscan

## How to use it

1.  Click the "Use this template" green button
2.  `yarn install`
3.  Modify the contract/test case
4.  Run the contract locally with `yarn chain` and `yarn deploy` (deploy to local hardhat network)
5.  Test the contract with `yarn test`
6.  Change `.env.example` into `.env` and configure it
7.  Deploy your contract where you want!

## TODO

- [ ] Support to eslint for the typescript testing lib
- [ ] Support for [hardhat-deploy](https://hardhat.org/plugins/hardhat-deploy.html), an Hardhat Plugin to better manage deployment
- [ ] Add support to [solidity-coverage](https://hardhat.org/plugins/solidity-coverage.html) plugin
- [ ] Add support to [hardhat-gas-reporter plugin](https://hardhat.org/plugins/hardhat-gas-reporter.html)
- [ ] TBD / Create a PR with suggestions!
