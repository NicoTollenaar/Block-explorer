const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const { response } = require('express');
const dateFns = require('date-fns');
const PORT = 1234;

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // console.log("app.use has been called, this is the access control header: ", res.get('Access-Control-Allow-Origin'));
    next();
});

app.use(express.json());

app.use(express.static('./client'));

app.post('/data', async (req, res) => {
    const APIKey = req.body.APIKey;
    delete req.body.APIKey;
    const requestData = req.body;
    console.log("decapitated req.body is: ", req.body);
    try {
        const resolvedValue = await fetchFromNode(APIKey, requestData);
        console.log("this is response received from Alchemy before sending back to browser: ", resolvedValue);
        res.send(resolvedValue);
    } catch (err) {
        console.log(err.message);
    }
});

async function fetchFromNode(apiKey, request) {
    console.log("this is request in fetchfrom node before conversion: ", request);
    console.log("type of typeof request.params[0]:", typeof request.params[0]);
    if (!isNaN(parseInt(request.params[0]))) {
        let hexNumber = (parseInt(request.params[0]).toString(16));
        request.params[0] = (`0x${hexNumber}`);
    }
    console.log("this is in fetchfromNode, logging apiKey and request arguments after conversion: ");
    console.log(apiKey, typeof apiKey);
    console.log(request, typeof request);
    console.log("now following with try");
    try {
        const response = await axios.post(apiKey, request);
        const fullBlockData = response.data.result;
        const processedData = processData(fullBlockData);
        return processedData;
    } catch (err) {
        console.log(err.message);
    }
}

function processData(originaldata) {
    const processedData = {
        blockNumber: parseInt(originaldata.number),
        time: getTime(originaldata.timestamp*1000),
        hash: originaldata.hash,
        parentHash: originaldata.parentHash,
        stateRoot: originaldata.stateRoot,
        difficulty: originaldata.difficulty,
        nonce: parseInt(originaldata.nonce),
        gasLimit : parseInt(originaldata.gasLimit),
        gasUsed : parseInt(originaldata.gasUsed),
        size: parseInt(originaldata.size),
        transactions : originaldata.transactions
    }
    console.log(processedData);
    return processedData;
}

function getTime(timestamp) {
    let now = new Date();
    let blockTime = new Date(timestamp);
    let timeElapsed = now.getTime() - blockTime.getTime();
    let timeAgo = dateFns.formatDistance(blockTime, now, {includeSeconds : true, addSuffix : true});
    let timeToReturn = timeAgo + " (" + blockTime.toLocaleString() + ")";
    return timeToReturn;
}

app.listen(PORT, () => {
    console.log(`Server running and listening on PORT ${PORT} ...`);
});