pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeUnivToken is ERC20 {
    constructor() ERC20("DeUniv", "DUV") public {
        _mint(msg.sender, 10000000000000000000000000000);
    }
}


/* IMPORTANT: How to co-own the paper */
contract DeUnivPaper is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping(uint256 => Paper) _paperMapping;

    struct Paper {
        string Title;
        string Description;
        mapping(address => int) Authors;
        string Data;
    }

    constructor() ERC721("DeUnivPaper", "DUPR") public {
    }

    function publishPaper(address author, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newPaperId = _tokenIds.current();
        _mint(author, newPaperId);
        _setTokenURI(newPaperId, tokenURI);        
        _paperMapping[newPaperId].Authors[author] = 100;
        return newPaperId;
    }
}

contract DeUnivMember is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => Member) _memberMapping;

    struct Member {
        int Reputation;
    }

    constructor() ERC721("DeUnivMember", "DUMR") public {
    }

    function registerMember(address member, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newMemberId = _tokenIds.current();
        _mint(member, newMemberId);
        _setTokenURI(newMemberId, tokenURI);
        _memberMapping[newMemberId].Reputation = 50;
        return newMemberId;
    }
}