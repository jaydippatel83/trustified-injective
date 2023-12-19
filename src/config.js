import { ethers } from "ethers";

export const trustifiedContracts = {
  injective: {
    trustified: "0xd105bf512DdD23fa93ca79DAAf9732bf5c6Fee0B",
    trustifiedIssuernft: "0x29eA5C17F7ff68DBe80f8844b25219588f9cC625",
  },
  mumbai: {
    trustified: "0x480a90061Eb948DdDe5cABD6529D2e9eD3298b3d", //v5
    trustifiedIssuernft: "0xa0f03408984424cdDc9688b5FED0AbCDBa6b4fEF",
    //trustified: "0xA7683AEDEcECc2C85EBB6D0f93a1AE852bBeA077", v4
  },
  ethereumtestnet: {
    trustified: "0x0C4DCc2dc216fF3Fe1A7A4F6c9B5D71cbA10AFC2",
    trustifiedIssuernft: "0x74eE14CD4f92131042acc08cE50176B351dF31e0",
  },
};

export const chain = {
  1738: "injective",
  80001: "mumbai",
  11155111: "ethereumtestnet",
};

export const logos = {
  mumbai: "/assets/logo/mumbai.png",
  injective: "/assets/logo/injective.webp",
  ether: "/assets/logo/ethereum.png",
  ethereumtestnet: "/assets/logo/ethereum.png",
};

export const networkURL = {
  injective: "https://inevm.calderaexplorer.xyz/tx",
  mumbai: "https://mumbai.polygonscan.com/tx",
  ethereumtestnet: "https://sepolia.etherscan.io/tx",
};

export const networkIds = {
  mumbai: 80001,
  injective: 1738,
  ethereumtestnet: 11155111,
};

export const chainParams = [
  {
    chainId: ethers.utils.hexValue(1738),
    rpcUrl: "https://inevm-rpc.caldera.dev/",
    chainName: "inEVM",
    symbol: "INJ",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(80001),
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    chainName: "Matic Mumbai",
    symbol: "MATIC",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(11155111),
    rpcUrl: "https://rpc2.sepolia.org",
    chainName: "Ethereum Sepolia",
    symbol: "ETH",
    decimals: 18,
  },
];

export const multiChains = [
  {
    label: "Polygon Mumbai",
    value: "mumbai",
    image: "/assets/coin.png",
    chainId: 80001,
    priority: 0,
  },
  {
    label: "Injective",
    value: "injective",
    image: "/assets/logo/injective.webp",
    chainId: 1738,
    priority: 1,
  },
];

export const fsize = [
  12, 14, 16, 18, 20, 24, 26, 30, 32, 36, 40, 42, 48, 50, 54, 60,
];
export const fbold = [100, 200, 300, 400, 500, 600, 700, 800, 900];
export const fontList = [
  "Roboto",
  "Borsok",
  "Open Sans",
  "Lato ",
  "Poppins",
  "Zeyada",
  "Babylonica",
  "Dancing Script",
  "Lobster",
  "Pacifico",
  "Caveat",
  "Satisfy",
  "Great Vibes",
  "Ole",
  "Coiny",
  "Kenia",
  "Rubik Beastly",
  "Londrina Sketch",
  "Neonderthaw",
  "Kumar One",
  "Ribeye",
  "Emblema One",
  "Ewert",
  "Kavoon",
  "Moul",
  "Rubik Moonrocks",
  "Rubik Iso",
  "Unifraktur Cook",
  "Germania One",
  "Monoton",
  "Orbitron",
  "Rampart One",
];
