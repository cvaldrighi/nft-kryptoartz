// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC165.sol";
import "./interfaces/IERC721.sol";

contract ERC721 is ERC165, IERC721 {
    mapping(uint256 => address) private _tokenOwner;
    mapping(address => uint256) private _ownedTokensCount;
    mapping(uint256 => address) private _tokenApprovals;

    constructor() {
        _registerInterface(
            bytes4(
                keccak256("balanceOf(bytes4)") ^
                    keccak256("ownerOf(bytes4)") ^
                    keccak256("transferFrom(bytes4)")
            )
        );
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        require(_owner != address(0), "Owner query for non-existent token");
        return _ownedTokensCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view override returns (address) {
        address owner = _tokenOwner[_tokenId];
        require(owner != address(0), "Owner query for non-existent token");
        return owner;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        //setting the address of nft owner to check the mapping
        //of the address from _tokenOwner at the tokenId
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: minting to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _tokenOwner[tokenId] = to;
        _ownedTokensCount[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(_to != address(0), "ERC721: Transfer to the zero address");
        require(
            ownerOf(_tokenId) == _from,
            "ERC721: Trying to transfer a token that the address does not own"
        );

        _tokenOwner[_tokenId] = _to;
        _ownedTokensCount[_from] -= 1;
        _ownedTokensCount[_to] += 1;

        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        _transferFrom(_from, _to, _tokenId);
    }
}
