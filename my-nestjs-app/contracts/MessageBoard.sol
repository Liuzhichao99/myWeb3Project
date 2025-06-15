// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageBoard {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] public messages;
    mapping(address => uint256[]) public userMessages;

    event NewMessage(address indexed sender, string content, uint256 timestamp);

    function postMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Message cannot be empty");
        require(bytes(_content).length <= 280, "Message too long");

        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });

        messages.push(newMessage);
        userMessages[msg.sender].push(messages.length - 1);

        emit NewMessage(msg.sender, _content, block.timestamp);
    }

    function getMessageCount() public view returns (uint256) {
        return messages.length;
    }

    function getMessage(uint256 index) public view returns (
        address sender,
        string memory content,
        uint256 timestamp
    ) {
        require(index < messages.length, "Message does not exist");
        Message memory message = messages[index];
        return (message.sender, message.content, message.timestamp);
    }

    function getUserMessageCount(address user) public view returns (uint256) {
        return userMessages[user].length;
    }

    function getUserMessage(address user, uint256 index) public view returns (
        address sender,
        string memory content,
        uint256 timestamp
    ) {
        require(index < userMessages[user].length, "Message does not exist");
        uint256 messageIndex = userMessages[user][index];
        Message memory message = messages[messageIndex];
        return (message.sender, message.content, message.timestamp);
    }
} 