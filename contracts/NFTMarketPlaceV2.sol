// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@layerzerolabs/solidity-examples/contracts/token/onft721/ProxyONFT721.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract NFTMarketPlace is ReentrancyGuard {


    IERC20 public paymentToken;

    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Invalid token address");
        paymentToken = IERC20(_paymentToken);
    }

    /// @notice Struct for listing
    /// @param price Price of the item
    /// @param seller Address of the seller
    /// @param proxyContract Address of the proxy contract, required for transferring the NFT cross-chain.
    /// If the NFT is not to be transferred cross-chain, this should be set to 0x0
    struct Listing {
        uint256 price;
        address seller;
        address proxyContract;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;
    mapping(address => uint256) private ERC20Balance;

    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    /////////////////////
    // Main Functions //
    /////////////////////
    /*
     * @notice Method for listing NFT
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param price sale price for each item
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address proxyContract
    )
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(
            price,
            msg.sender,
            proxyContract
        );
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    /*
     * @notice Method for cancelling listing
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function cancelListing(
        address nftAddress,
        uint256 tokenId
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    /*
     * @notice Method for buying listing
     * @notice The owner of an NFT could unapprove the marketplace,
     * which would cause this function to fail
     * Ideally you'd also have a `createOffer` functionality.
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function buyItem(
        address nftAddress,
        uint256 tokenId
    )
        external
        payable
        isListed(nftAddress, tokenId)
        // isNotOwner(nftAddress, tokenId, msg.sender)
        nonReentrant
    {
        // Challenge - How would you refactor this contract to take:
        // 1. Abitrary tokens as payment? (HINT - Chainlink Price Feeds!)
        // 2. Be able to set prices in other currencies?
        // 3. Tweet me @PatrickAlphaC if you come up with a solution!
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value;
        // Could just send the money...
        // https://fravoll.github.io/solidity-patterns/pull_over_push.html
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function buyItemCrossChain(
        address nftAddress,
        uint256 tokenId,
        address payable buyer,
        uint256 amount
    ) external nonReentrant isListed(nftAddress, tokenId) {
        Listing memory listedItem = s_listings[nftAddress][tokenId];

        _validateAmount(amount, listedItem.price, nftAddress, tokenId);

        delete s_listings[nftAddress][tokenId];

        _approveNFT(listedItem.proxyContract, nftAddress, tokenId);

        bytes memory adapterParams = _createAdapterParams(buyer);

        uint256 fee = _estimateFee(listedItem.proxyContract, buyer, tokenId, adapterParams);

        _sendNFT(listedItem, buyer, tokenId, adapterParams, fee);

        s_proceeds[listedItem.seller] += amount;

        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function _validateAmount(
        uint256 amount,
        uint256 price,
        address nftAddress,
        uint256 tokenId
    ) internal pure {
        if (amount < price) {
            revert PriceNotMet(nftAddress, tokenId, price);
        }
    }

    function _approveNFT(
        address proxyContract,
        address nftAddress,
        uint256 tokenId
    ) internal {
        IERC721 NFTContract = IERC721(nftAddress);
        NFTContract.approve(proxyContract, tokenId);
    }

    function _createAdapterParams(address buyer) internal pure returns (bytes memory) {
        return abi.encodePacked(
            uint16(2),
            uint256(100000 + 6000),
            uint256(0),
            buyer
        );
    }

    function _estimateFee(
        address proxyContract,
        address buyer,
        uint256 tokenId,
        bytes memory adapterParams
    ) internal view returns (uint256) {
        (uint256 fee, ) = ProxyONFT721(proxyContract).estimateSendFee(
            97,
            abi.encodePacked(buyer),
            tokenId,
            false,
            adapterParams
        );
        return fee;
    }

    function _sendNFT(
        Listing memory listedItem,
        address payable buyer,
        uint256 tokenId,
        bytes memory adapterParams,
        uint256 fee
    ) internal {
        ProxyONFT721 proxyContract = ProxyONFT721(listedItem.proxyContract);
        proxyContract.sendFrom{value: fee}(
            listedItem.seller,
            97,
            abi.encodePacked(buyer),
            tokenId,
            buyer,
            address(0),
            adapterParams
        );
    }

    function increaseERC20Balance(uint256 amount, address srcAddress) external {
        ERC20Balance[srcAddress] += amount;
    }

    /*
     * @notice Method for updating listing
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param newPrice Price in Wei of the item
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        //We should check the value of `newPrice` and revert if it's below zero (like we also check in `listItem()`)
        if (newPrice <= 0) {
            revert PriceMustBeAboveZero();
        }
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    /*
     * @notice Method for withdrawing proceeds from sales
     */
    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    /////////////////////
    // Getter Functions //
    /////////////////////

    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
