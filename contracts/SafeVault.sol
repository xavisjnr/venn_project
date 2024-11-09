// SPDX-License-Identifier: UNLICENSED
// See LICENSE file for full license text.
// Copyright (c) Ironblocks 2024
pragma solidity ^0.8;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

contract SafeVault is Ownable {
    mapping(address user => uint256 ethBalance) public deposits;

    constructor() Ownable(msg.sender) {}

    function deposit() external payable {
        deposits[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        deposits[msg.sender] -= amount;
        Address.sendValue(payable(msg.sender), amount);
    }
}
