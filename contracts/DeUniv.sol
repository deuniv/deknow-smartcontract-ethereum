pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeUnivToken is ERC20 {
    constructor() ERC20("DeUniv", "DUV") public {
        _mint(msg.sender, 10000000000000000000000000000);
    }
}

interface IDeUnivMember {
    function getMemberId(address memberAddress) external view returns (uint256);
}

contract DeUnivMember is IDeUnivMember, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => Member) _memberMapping;
    mapping(address => uint256) _addrToMember;

    struct Member {
        int Reputation;
    }

    constructor() ERC721("DeUnivMember", "DUMR") public {
    }

    function registerMember(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newMemberId = _tokenIds.current();
        _mint(msg.sender, newMemberId);
        _setTokenURI(newMemberId, tokenURI);
        _memberMapping[newMemberId].Reputation = 50;
        _addrToMember[msg.sender] = newMemberId;
        return newMemberId;
    }

    function getMemberId(address memberAddress) public override view returns (uint256) {
        require(_addrToMember[memberAddress] > 0, "Requester address is not registered");
        return _addrToMember[memberAddress];
    }
}

/* IMPORTANT: How to co-own the paper */
contract DeUnivPaper is ERC721 {
    using Counters for Counters.Counter;

    address private DEUNIV_MEMBER_CONTRACT;

    Counters.Counter private _tokenIds;
    mapping(uint256 => Paper) _paperMapping;

    struct Paper {
        string Title;
        string Description;
        mapping(address => int) AuthorMap;
        uint256[] Authors;
        string Data;
        bool Created;
    }

    event PaperPublished(address author, string tokenURI);
    event PaperUpdated(uint256 paperId, address author, string tokenURI);

    constructor() ERC721("DeUnivPaper", "DUPR") public {
    }

    function setInternal(address memberContract) public {
        DEUNIV_MEMBER_CONTRACT = memberContract;
    }

    function publishPaper(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newPaperId = _tokenIds.current();
        _mint(msg.sender, newPaperId);
        _setTokenURI(newPaperId, tokenURI);        
        _paperMapping[newPaperId].AuthorMap[msg.sender] = 100;


        IDeUnivMember members = IDeUnivMember(DEUNIV_MEMBER_CONTRACT);
        _paperMapping[newPaperId].Authors = [members.getMemberId(msg.sender)];
        _paperMapping[newPaperId].Created = true;

        emit PaperPublished(msg.sender, tokenURI);

        return newPaperId;
    }

    function updatePaper(uint256 paperId, string memory tokenURI) public {
        require(_paperMapping[paperId].Created && _paperMapping[paperId].AuthorMap[msg.sender] > 0);

        _setTokenURI(paperId, tokenURI);        
        emit PaperUpdated(paperId, msg.sender, tokenURI);
    }

    function getAuthors(uint256 paperId) public view returns (uint256[] memory) {
        require(_paperMapping[paperId].Created);
        return _paperMapping[paperId].Authors;
    }
}