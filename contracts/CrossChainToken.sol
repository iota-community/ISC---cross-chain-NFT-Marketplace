// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@layerzerolabs/solidity-examples/contracts/token/oft/v1/OFTCore.sol";
import "@layerzerolabs/solidity-examples/contracts/token/oft/v1/interfaces/IOFT.sol";
contract CrossChainToken is OFTCore, ERC20, IOFT {
    constructor(address _lzEndpointAddress) ERC20("CrossChainTokens", "CCT") OFTCore(_lzEndpointAddress) Ownable() {
        if (block.chainid == 97) {
            _mint(msg.sender, 1_000_000 * 10 ** decimals());
        }
    }
    function supportsInterface(bytes4 interfaceId) public view virtual override(OFTCore, IERC165) returns (bool) {
        return interfaceId == type(IOFT).interfaceId || interfaceId == type(IERC20).interfaceId || super.supportsInterface(interfaceId);
    }
    function token() public view virtual override returns (address) {
        return address(this);
    }
    function circulatingSupply() public view virtual override returns (uint) {
        return totalSupply();
    }
    function _debitFrom(address _from, uint16, bytes memory, uint _amount) internal virtual override returns(uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _burn(_from, _amount);
        return _amount;
    }
    function _creditTo(uint16, address _toAddress, uint _amount) internal virtual override returns(uint) {
        _mint(_toAddress, _amount);
        return _amount;
    }

    function sendTokensWithMessage(
        address _from,
        uint16 _dstChainId,
        bytes memory _toAddress,
        uint _amount,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes memory _adapterParams,
        address tokenAddress,
        uint256 tokenId
    ) external payable {
        // Debit the tokens from the sender
        uint amount = _debitFrom(_from, _dstChainId, _toAddress, _amount);

        // Encode the payload with the custom message
        bytes memory lzPayload = abi.encode(PT_SEND, _toAddress, amount, tokenAddress, tokenId);

        // Send the message and tokens cross-chain
        _lzSend(_dstChainId, lzPayload, _refundAddress, _zroPaymentAddress, _adapterParams, msg.value);

        // Emit the event
        emit SendToChain(_dstChainId, _from, _toAddress, amount);
    }



    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal override {
        // Decode the payload
        (bytes memory toAddressBytes, uint256 amount, address tokenAddress, uint256 tokenId) = abi.decode(_payload, (bytes, uint256, address, uint256));

        //require(packetType == PT_SEND, "CrossChainToken: invalid packet type");

        //address to = abi.decode(toAddress, (address));
        address to;
        assembly {
            to := mload(add(toAddressBytes, 20))
        }

        // Credit the tokens to the recipient (the cross chain contract)
        _creditTo(_srcChainId, to, amount);

        // Increment the user's balance in the marketplace contract


        emit CustomMessageReceived( amount, tokenAddress, tokenId, to);
        emit EmitPayload(_payload);
    }

    function _handleCustomMessage(
        address to,
        uint256 amount,
        address tokenAddress,
        uint256 tokenId
    ) internal {
        // Implement your custom logic here, e.g., log the message or trigger other actions
        //emit CustomMessageReceived(to, amount, "Custom message received", tokenAddress, tokenId);
    }

    event CustomMessageReceived( uint256 amount, address tokenAddress, uint256 tokenId, address to);

    event EmitPayload(bytes payload);

    
}
