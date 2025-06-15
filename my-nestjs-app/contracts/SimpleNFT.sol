// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SimpleNFT is ERC721URIStorage {
    uint256 public nextTokenId;
    mapping(address => bool) public hasMinted;

    constructor() ERC721("SimpleNFT", "SNFT") {}

    function mint(string memory tokenURI) external {
        require(!hasMinted[msg.sender], "Already minted");
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        hasMinted[msg.sender] = true;
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 idx = 0;
        for (uint256 i = 0; i < nextTokenId; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    tokens[idx++] = i;
                }
            } catch {
                // token does not exist, skip
            }
        }
        return tokens;
    }
} 