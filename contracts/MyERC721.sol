// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC721 is ERC721Enumerable, Ownable {
    string public _baseTokenURI;
    uint32 public _tokenId = 0;

    event EventSetBaseURI(string baseURI);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenLink
    ) ERC721(_name, _symbol) {
        _baseTokenURI = _baseTokenLink;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;

        emit EventSetBaseURI(baseURI);
    }

    function mint() external onlyOwner {
        _safeMint(msg.sender, _tokenId, "");
        _tokenId++;
    }

    function transfer(address to, uint tokenId) external {
        _safeTransfer(msg.sender, to, tokenId, "");
    }

    function isApprovedOrOwner(address spender, uint tokenId) external view virtual returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }
}