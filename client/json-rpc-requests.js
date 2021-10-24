const axios = require('axios');
const dateFns = require('date-fns');
require('dotenv').config();

const jsonRpcMethod = "eth_getBlockByNumber";

async function jsonRpcRequest(network, method, params) {
    if (typeof params[0] !== "string") {
        params[0] = (`0x${params[0].toString(16)}`);
    } 
    const requestData = {
        "jsonrpc":"2.0",
        method,
        params,
        id : network.chainId
    }
    try {
        return await axios.post(network.APIKey, requestData);
    } catch (err) {
        console.log(err);
    }
}

async function createBlockObject (network, params) {
    const response = await jsonRpcRequest(network, jsonRpcMethod, params);
    const responseResult = response.data.result;
    console.log(Object.keys(responseResult));
    const blockKeyData = {
        network: network.name,
        blockNumber: parseInt(responseResult.number),
        time: getTime(responseResult.timestamp*1000),
        hash: responseResult.hash,
        parentHash: responseResult.parentHash,
        stateRoot: responseResult.stateRoot,
        difficulty: responseResult.difficulty,
        nonce: parseInt(responseResult.nonce),
        gasLimit : parseInt(responseResult.gasLimit),
        gasUsed : parseInt(responseResult.gasUsed),
        size: parseInt(responseResult.size),
        numberOfTransactions : responseResult.transactions.length,
        transactions : responseResult.transactions
    }
    console.log(blockKeyData);
    return blockKeyData;
}

function getTime(timestamp) {
    let now = new Date();
    let blockTime = new Date(timestamp);
    let timeElapsed = now.getTime() - blockTime.getTime();
    if (timeElapsed < 1000*60*60*24*31) {
    let timeAgo = dateFns.formatDistance(blockTime, now, {includeSeconds : true, addSuffix : true});
    let timeToReturn = timeAgo + " (" + blockTime.toLocaleString() + ")";
    console.log("typeof localestring: ", blockTime.toLocaleString());
    return timeToReturn;
    } else {
        return blockTime.toLocaleString();
    }
}

// jsonRpcRequest(chosenNetwork, chosenMethod, chosenParams);
// createBlockObject(chosenNetwork, chosenParams);

module.exports = {
    jsonRpcRequest,
    createBlockObject,
    getTime,
    Mainnet,
    Ropsten,
    Rinkeby,
    Goerli,
    Kovan
}