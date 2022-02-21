pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DeUnivPaper is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("DeUnivPaper", "DUPR") public {
    }

    function publishPaper(address member, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newPaperId = _tokenIds.current();
        _mint(member, newPaperId);
        _setTokenURI(newPaperId, tokenURI);

        return newPaperId;
    }
}

contract DeUnivMember is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("DeUnivPaper", "DUMR") public {
    }

    function registerMember(address member, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newMemberId = _tokenIds.current();
        _mint(member, newMemberId);
        _setTokenURI(newMemberId, tokenURI);

        return newMemberId;
    }
}