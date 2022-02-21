# Smart Contract - Baseline

## Tech Stack
| Coding                | Dev/Testing | Deployment    | Public Access                |
|-----------------------|-------------|---------------|------------------------------|
| Open Zeppelin Library | Hardhat     | Truffle Teams | Open Zeppelin Defender Relay |

#### Deployment
- CI/CD: Truffle Teams
- Access: OpenZeppelin Defender Relay

#### Testing Environment
Hardhat local node
Hardhat Mainnet forking with Alchemy API

#### Development Environment
- Local: Hardhat
- Ci/CD: Truffle Teams

#### Using Hardhat Interface
- Typescript
- Hardhat
- Ether.js
- Waffle

#### Smart Contract Framework
openzepplin

#### Language
solidity 0.7.3

## Development and Deployment
#### Hardhat

https://hardhat.org/getting-started/#installation
```
npm install --save-dev hardhat
npx hardhat
npx hardhat accounts
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat run scripts/sample-script.js --network localhost
```

#### Open Zeppelin

https://docs.openzeppelin.com/upgrades-plugins/1.x/
```
npm install @openzeppelin/contracts
npm install --save-dev @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-ethers ethers
```

#### Testing Using Mainnet Forking

https://hardhat.org/guides/mainnet-forking.html

Using Hardhat test network to have better solidity stack traces.
Also we should use pinning mode.
```
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key> --fork-block-number 11095000
```

#### Using Hardhat Libraries

https://rahulsethuram.medium.com/the-new-solidity-dev-stack-buidler-ethers-waffle-typescript-tutorial-f07917de48ae
```
npm install --save-dev ts-node typescript @types/node @types/mocha
npm install --save-dev hardhat-typechain typechain ts-generator @typechain/ethers-v5
```

#### Sample Interface

React Typescript

https://create-react-app.dev/docs/adding-typescript/
https://github.com/nomiclabs/hardhat-hackathon-boilerplate
```
npm install --save-dev @ethers-react/system
npx create-react-app counter-app --template typescript
```

#### Manual Deployment
```
sol-merger --remove-comments contracts/DeUniv.sol
```