// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC721Connector.sol";

contract KryptoArt is ERC721Connector {
    string[] public kryptoArtz;

    mapping(string => bool) _kryptoArtzExists;

    function mint(string memory _kryptoArt) public {
        require(
            !_kryptoArtzExists[_kryptoArt],
            "Error - KryptoArt already exists"
        );

        kryptoArtz.push(_kryptoArt);
        uint256 _id = kryptoArtz.length - 1;

        _mint(msg.sender, _id);
        _kryptoArtzExists[_kryptoArt] = true;
    }

    constructor() ERC721Connector("KryptoArt", "KARTZ") {}
}
