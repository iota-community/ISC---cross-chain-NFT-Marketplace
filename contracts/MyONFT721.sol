// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "@layerzerolabs/solidity-examples/contracts/token/onft721/ONFT721.sol";

contract MyONFT721 is ONFT721 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint _minGasToTransfer,
        address _lzEndpoint
    ) ONFT721(_name, _symbol, _minGasToTransfer, _lzEndpoint) {}


    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal virtual override {
        // decode and load the toAddress
        (bytes memory toAddressBytes, uint[] memory tokenIds) = abi.decode(_payload, (bytes, uint[]));

        address toAddress;
        assembly {
            toAddress := mload(add(toAddressBytes, 20))
        }

        // mint the tokens and allow the marketplace to transfer them
        for (uint i = 0; i < tokenIds.length; i++) {
            _creditTo(0, toAddress, tokenIds[i]);
             
        }

        uint nextIndex = _creditTill(_srcChainId, toAddress, 0, tokenIds);
        if (nextIndex < tokenIds.length) {
            // not enough gas to complete transfers, store to be cleared in another tx
            bytes32 hashedPayload = keccak256(_payload);
            storedCredits[hashedPayload] = StoredCredit(_srcChainId, toAddress, nextIndex, true);
            emit CreditStored(hashedPayload, _payload);
        }

        emit ReceiveFromChain(_srcChainId, _srcAddress, toAddress, tokenIds);
    }
}