// import {ALCHEMY_API_KEY_GOERLI, ALCHEMY_API_KEY_RINKEBY, ALCHEMY_API_KEY_Ropsten, ALCHEMY_API_KEY_KOVAN, ALCHEMY_API_KEY_MAINNET} from '../keys.js';
// import { formatDistance } from '../node_modules/date-fns/formatDistance';

const ALCHEMY_API_KEY_RINKEBY = "https://eth-rinkeby.alchemyapi.io/v2/7eJSSFxEImk4KkiEgIqx92i5r29HLEUK";
const ALCHEMY_API_KEY_Ropsten = "https://eth-ropsten.alchemyapi.io/v2/7eJSSFxEImk4KkiEgIqx92i5r29HLEUK";
const ALCHEMY_API_KEY_KOVAN = "https://eth-kovan.alchemyapi.io/v2/7eJSSFxEImk4KkiEgIqx92i5r29HLEUK";
const ALCHEMY_API_KEY_MAINNET = "https://eth-mainnet.alchemyapi.io/v2/7eJSSFxEImk4KkiEgIqx92i5r29HLEUK";
const ALCHEMY_API_KEY_GOERLI = "https://eth-goerli.alchemyapi.io/v2/7eJSSFxEImk4KkiEgIqx92i5r29HLEUK";

const Mainnet = {name: "Mainnet", APIKey: ALCHEMY_API_KEY_MAINNET, chainId: 1};
const Ropsten = {name: "Ropsten", APIKey: ALCHEMY_API_KEY_Ropsten, chainId: 3};
const Rinkeby = {name: "Rinkeby", APIKey: ALCHEMY_API_KEY_RINKEBY, chainId: 4};
const Goerli = {name: "Goerli", APIKey: ALCHEMY_API_KEY_GOERLI, chainId: 5};
const Kovan = {name: "Kovan", APIKey: ALCHEMY_API_KEY_KOVAN, chainId: 42};
const server = "http://localhost:1234";
let networkObject = Mainnet;

document.getElementById("button").addEventListener("click", fetchBlockData);

async function fetchBlockData () {
    let selectedNetwork = document.getElementById("network");
    console.dir(selectedNetwork);
    let chosenNetwork = selectedNetwork.options[selectedNetwork.selectedIndex].value;
    let selectedMethod = document.getElementById("search-by");
    let searchMethod = selectedMethod.options[selectedMethod.selectedIndex].value;
    let searchInput = document.getElementById('search-input').value;
    let params = [searchInput, false];

    console.log(chosenNetwork, searchMethod, searchInput);

    switch (chosenNetwork) {
        case "Kovan": 
            networkObject = Kovan;
            break;
        case "Goerli":
            networkObject = Goerli;
            break;
        case "Ropsten":
            networkObject = Ropsten;
            console.log("networkObject in case Ropsten: ", networkObject);
            break;
        case "Rinkeby":
            networkObject = Rinkeby;
            break;
        default:
            networkObject = Mainnet;
            break;
    }

    console.log("networkObject after chosen: ", networkObject);

    let method = "eth_getBlockByNumber";

    if (searchMethod === "Block number") { 
        method = "eth_getBlockByNumber";
        if (typeof searchInput !== "string") {
            params[0] = (`0x${searchInput.toString(16)}`);
        }
    }

    const requestData = {
        APIKey: networkObject.APIKey, 
        "jsonrpc":"2.0",
        method,
        params,
        id : networkObject.chainId
    }
    try {
        const response = await axios.post(`${server}/data`, requestData);
        console.log("is this being logged, response: ", response);
        const blockData = response.data;
        console.log("this is blockData back from server after processing: ", blockData);
        renderTable(blockData); 
    } catch (err) {
        console.log(err);
    }
}

function renderTable (blockdata) {
    let section = document.querySelector("section");
    if (section) {
    document.getElementById ("insert-after-this-div").removeChild(section);
    }
    let html = `
        <table>
        <tbody>
        <tr>
            <th scope="row">Network</th>
            <td>${networkObject.name}</td>
        </tr>
        <tr>
            <th scope="row">Block number</th>
            <td>${blockdata.blockNumber}</td>
        </tr>
        <tr>
            <th scope="row">Time</th>
            <td>${blockdata.time}</td>
        </tr>
        <tr>
            <th scope="row">Hash</th>
            <td>${blockdata.hash}</td>
        </tr>
        <tr>
            <th scope="row">Parent hash</th>
            <td>${blockdata.parentHash}</td>
        </tr>
        <tr>
            <th scope="row">State root</th>
            <td>${blockdata.stateRoot}</td>
        </tr>
        <tr>
            <th scope="row">Difficulty</th>
            <td>${blockdata.difficulty}</td>
        </tr>
        <tr>
            <th scope="row">Nonce</th>
            <td>${blockdata.nonce}</td>
        </tr>
        <tr>
            <th scope="row">Gas limit</th>
            <td>${blockdata.gasLimit}</td>
        </tr>
        <tr>
            <th scope="row">Gas used</th>
            <td>${blockdata.gasUsed}</td>
        </tr>
        <tr>
            <th scope="row">Size</th>
            <td>${blockdata.size}</td>
        </tr>
        <tr>
            <th scope="row">Transactions</th>
            <td><a href="http://localhost:1234/transactions">${blockdata.transactions.length} transactions</a></td>
        </tr>
        </tbody>
        </table> `;
    let newSection = document.createElement("section");
    document.getElementById ("insert-after-this-div").appendChild(newSection);
    newSection.innerHTML = html;
}
