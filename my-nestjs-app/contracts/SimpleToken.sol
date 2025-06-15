// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // 初始铸造 1000000 个代币给合约部署者
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // 管理员可以增发代币
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // 查询余额
    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    // 转账
    function transfer(address to, uint256 amount) public override returns (bool) {
        return super.transfer(to, amount);
    }
} 