/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IDeKnowScholar } from "../IDeKnowScholar";

export class IDeKnowScholar__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDeKnowScholar {
    return new Contract(address, _abi, signerOrProvider) as IDeKnowScholar;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "scholarAddress",
        type: "address",
      },
    ],
    name: "getScholarId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
