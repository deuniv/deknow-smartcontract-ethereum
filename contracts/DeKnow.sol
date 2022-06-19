pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeuToken is ERC20 {
    constructor() ERC20("Deu", "DEU") public {
        _mint(msg.sender, 10000000000000000000000000000);
    }
}

interface IDeKnowScholar {
    function getScholarId(address scholarAddress) external view returns (uint256);
}

contract DeKnowScholar is IDeKnowScholar, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => Scholar) _scholarMapping;
    mapping(address => uint256) _addrToScholar;

    struct Scholar {
        int Reputation;
        string Author;
        string ProfileImageUri;
    }

    constructor() ERC721("DeKnowScholar", "DKS") public {
    }

    function registerScholar(string memory tokenURI, string memory author) public returns (uint256) {
        _tokenIds.increment();

        uint256 newScholarId = _tokenIds.current();
        _mint(msg.sender, newScholarId);
        _setTokenURI(newScholarId, tokenURI);
        _scholarMapping[newScholarId].Reputation = 50;
        _addrToScholar[msg.sender] = newScholarId;
        return newScholarId;
    }

    function setProfileImage(uint256 scholarId, string memory profileImageUri) public {
        _scholarMapping[scholarId].ProfileImageUri = profileImageUri;
    }

    function getScholarId(address scholarAddress) public override view returns (uint256) {
        require(_addrToScholar[scholarAddress] > 0, "Requester address is not registered");
        return _addrToScholar[scholarAddress];
    }

    function getAuthor(uint256 scholarId) public view returns (string memory) {
        return _scholarMapping[scholarId].Author;
    }
}

/* IMPORTANT: How to co-own the paper */
contract DeKnowPaper is ERC1155 {
    using Counters for Counters.Counter;

    address private DEUNIV_MEMBER_CONTRACT;

    Counters.Counter private _tokenIds;
    mapping(uint256 => Paper) _paperMapping;

    struct Paper {
        string Title;
        string Description;
        mapping(uint256 => int) AuthorMap;
        uint256[] Authors;
        string Data;
        bool Created;
        uint256[] References;
    }

    event PaperPublished(address author, uint256 memberId, string tokenURI);
    event PaperPublished2(uint256 paperId, address author, uint256 memberId);
    event PaperPublished3(uint256 memberId, uint256 paperId, address author);
    event PaperUpdated(uint256 paperId, uint256 memberId, address author, string tokenURI);
    event PaperUpdated2(uint256 memberId, uint256 paperId, address author);
    event AuthorRemoved(uint256 paperId, uint256 memberId, address byAuthor);
    event AuthorAdded(uint256 paperId, uint256 memberId, address byAuthor);
    event ReferenceRemoved(uint256 paperId, uint256 refPaperId, address byAuthor);
    event ReferenceAdded(uint256 paperId, uint256 refPaperId, address byAuthor);

    constructor() ERC1155("") public {
    }

    function setInternal(address memberContract) public {
        DEUNIV_MEMBER_CONTRACT = memberContract;
    }

    function publishPaper(string memory tokenURI) public returns (uint256) {
        IDeKnowScholar members = IDeKnowScholar(DEUNIV_MEMBER_CONTRACT);
        uint256 memberId = members.getScholarId(msg.sender);
        require(memberId > 0);

        _tokenIds.increment();

        uint256 newPaperId = _tokenIds.current();
        // _mint(msg.sender, newPaperId);
        // _setTokenURI(newPaperId, tokenURI);        
        _paperMapping[newPaperId].AuthorMap[memberId] = 100;
        _paperMapping[newPaperId].Authors = [memberId];
        _paperMapping[newPaperId].Created = true;

        emit PaperPublished(msg.sender, memberId, tokenURI);
        emit PaperPublished2(newPaperId, msg.sender, memberId);
        emit PaperPublished3(memberId, newPaperId, msg.sender);

        return newPaperId;
    }

    function updatePaper(uint256 paperId, string memory tokenURI) public {
        IDeKnowScholar members = IDeKnowScholar(DEUNIV_MEMBER_CONTRACT);
        uint256 memberId = members.getScholarId(msg.sender);
        require(_paperMapping[paperId].Created && _paperMapping[paperId].AuthorMap[memberId] > 0);

        // _setTokenURI(paperId, tokenURI);        
        emit PaperUpdated(paperId, memberId, msg.sender, tokenURI);
        emit PaperUpdated2(memberId, paperId, msg.sender);
    }

    function updateReferences(uint256 paperId, uint256[] memory references) public {
        IDeKnowScholar members = IDeKnowScholar(DEUNIV_MEMBER_CONTRACT);
        uint256 memberId = members.getScholarId(msg.sender);
        require(_paperMapping[paperId].Created && _paperMapping[paperId].AuthorMap[memberId] > 0);

        for(uint idx = 0; idx < _paperMapping[paperId].References.length; idx ++) {
            emit ReferenceRemoved(paperId, _paperMapping[paperId].References[idx], msg.sender);
        }
        _paperMapping[paperId].References = references;
        for(uint idx = 0; idx < _paperMapping[paperId].References.length; idx ++) {
            emit ReferenceAdded(paperId, _paperMapping[paperId].References[idx], msg.sender);
        }
    }

    function updateAuthors(uint256 paperId, uint256[] memory authors) public {
        IDeKnowScholar members = IDeKnowScholar(DEUNIV_MEMBER_CONTRACT);
        uint256 memberId = members.getScholarId(msg.sender);
        require(_paperMapping[paperId].Created && _paperMapping[paperId].AuthorMap[memberId] > 0);

        // clear current mappings
        for(uint idx = 0; idx < _paperMapping[paperId].Authors.length; idx ++) {
            delete _paperMapping[paperId].AuthorMap[_paperMapping[paperId].Authors[idx]];
            emit AuthorRemoved(paperId, _paperMapping[paperId].Authors[idx], msg.sender);
        }
        // Set new mappings and list
        _paperMapping[paperId].Authors = authors;
        for(uint idx = 0; idx < authors.length; idx++) {
            _paperMapping[paperId].AuthorMap[authors[idx]] = 1;
            emit AuthorAdded(paperId, authors[idx], msg.sender);
        }
    }

    function getAuthors(uint256 paperId) public view returns (uint256[] memory) {
        require(_paperMapping[paperId].Created);
        return _paperMapping[paperId].Authors;
    }

    function getReferences(uint256 paperId) public view returns (uint256[] memory) {
        require(_paperMapping[paperId].Created);
        return _paperMapping[paperId].References;
    }
}