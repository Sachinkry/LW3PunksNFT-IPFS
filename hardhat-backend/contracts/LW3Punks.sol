// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LW3Punks is ERC721Enumerable, Ownable {
    using Strings for uint256;

    /**
     * @dev _baseTokenUri for computing 'tokenURI'. If set, 'tokenURI' is concatenation of `baseURI' and 'tokenURI'
     */
    string _baseTokenURI;

    // no of nft - 10
    // price of each nft
    // mint function to mint nfts
    // setPuase function to stop from minting
    // withdraw function to withdraw eths gained from selling nfts - onlyOnwer
    
    // no of tokens minted
    uint256 public tokenIds;

    // max tokens that can be minted
    uint256 public constant maxTokenIds = 10;

    // price of each token
    uint256 public _price = 0.01 ether;

    // keep track of whether minting is paused or not
    bool public isPaused;


    // only when not pause modifier
    modifier onlyWhenNotPaused{
        require(!isPaused, "Contract is paused!!");
        _;
    }

    mapping(uint256 => address) public mintedTokenIds;

    // constructor to set _baseTokenURI to baseURI
    // and set name and symbol for the tokens 
    constructor(string memory baseURI) ERC721("LW3Punks", "LW3P") {
        _baseTokenURI = baseURI;
    }

    /// @dev mint() - for minting tokens
    function mint() public payable onlyWhenNotPaused {
        require(tokenIds < maxTokenIds, "Exceeded max LW3Punks token supply");
        require(msg.value >= _price, "Not enough price sent!");

        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    /**
     * @dev _baseURI overrides the Openzeppelin's ERC721 implemention of _baseURI function which by default returns an empty string
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev tokenURI overrides the Openzeppelin's ERC721 implementation of tokenURI function 
     * It returns the URI from which we can extract the metadata of a given tokenId
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();

        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }


    function setPause(bool _isPaused) public onlyOwner {
        isPaused = _isPaused;
    }

    // withdraw function 
    function withdraw() public onlyOwner {
        address _owner = msg.sender;
        uint amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send ether!!");
    }

    // function to receive ether when msg.data is empty
    receive() external payable {} 

    // fallback would be called when msg.data is not empty
    fallback() external payable {} 



}