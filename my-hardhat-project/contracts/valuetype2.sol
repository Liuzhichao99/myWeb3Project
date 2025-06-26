// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
contract ValueType{
    int public _int = -1; //整数，包括负数
    uint public _uint = 1; //无符号整数
    uint256 public _number = 20220330; //256位无符号整数
    uint public _number1 = _number + 1; // +， - ， * , /
    uint public _number2 = 2**2; //指数
    uint public _number3 = 7%2;//余数
    bool public _numberbool = _number2 > _number3; //比大小

}