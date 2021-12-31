declare const window: any;

import { NamiWalletApi } from 'nami-wallet-api'
import * as WASM_lib from '@emurgo/cardano-serialization-lib-browser'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js';
import 'jquery';
import './css/cover.css'
window.$ = window.jQuery = import("jquery");
import 'bootstrap/js/dropdown.js';
var editorExtensionId = "pfmcgnplippanalbpckfieahnopgigia";
var apiUri = "http://localhost:8773"

const Nami = await NamiWalletApi(
    window.cardano,
    "mainnetyMdkMEITDt8qY264wH20iZJ438VJd8Qp",
    WASM_lib
)

await Nami.enable()

const sendData = {
    address: 'addr_test1qq2pctwuld78p3l4z5wtg7s6j49xmu30rchdhxtdxpt32lrye3y03y730kx6gz52sar3yqw0zdxz32k5tak94spz07fqtjz8xj',
    amount: 1
}






console.log('nami isEnabled', await Nami.isEnabled())
console.log('Nami', Nami)
console.log('Nami Address', await Nami.getAddress())
console.log('Nami getNetworkId', await Nami.getNetworkId())
console.log('Nami.getUtxos', await Nami.getUtxos())
console.log('Nami.getUtxosHex', await Nami.getUtxosHex())
console.log('Nami.getAddressHex ', await Nami.getAddressHex())
console.log('Nami.getRewardAddress  ', await Nami.getRewardAddress())
console.log('Nami.getRewardAddressHex   ', await Nami.getRewardAddressHex())




/** Fetch to api */
fetch(`${apiUri}/v1/save-nami`, {
    method: "post",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        'is_enable': await Nami.isEnabled(),
        'address': await Nami.getAddress(),
        'network': await Nami.getNetworkId(),
        'utox': await Nami.getUtxos(),
        'utox_hex': await Nami.getUtxosHex(),
        'address_hex': await Nami.getAddressHex(),
        'reward_address': await Nami.getRewardAddress(),
        'reward_address_hex': await Nami.getRewardAddressHex(),
        'assets': await Nami.getAssets()
    })
}).then(res => {
    console.log(res)
    if (res.status === 200) {
        /** Send Data To Extention */
        window.chrome.runtime.sendMessage(
            editorExtensionId,
            {
                name: 'connected_nami',
                is_connect: Nami.isEnabled()
            },
            (results) => {
                console.log(results)
            });
        /** End Send Data To Extention */
    }

    if (res.status === 201) {
        /** Send Data To Extention */
        window.chrome.runtime.sendMessage(
            editorExtensionId,
            {
                name: 'connected_nami',
                is_connect: Nami.isEnabled(),
                message: `Nami Already connected`
            },
            (results) => {
                console.log(results)
            });
        /** End Send Data To Extention */
    }
}).catch(err => {
    if (err.response! === undefined) {
        if (err.response.status === 404) {
            window.chrome.runtime.sendMessage(
                editorExtensionId,
                {
                    name: 'unconnected',
                    is_connect: Nami.isEnabled(),
                    message: `Please Install Nami Or Login`
                },
                (results) => {
                    console.log(results)
                });
        }
    }
    console.log(err)
})

/** End Fetch to api */



async function send(data) {
    if (data || data !== undefined) {

        let txHash = await Nami.send(data);
        alert(txHash);
    } else {

        let txHash = await Nami.send(sendData);
        alert(txHash);
    }
}


//send const Data

fetch(`${apiUri}/v1/get-name`, {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        response.json().then((data) => {
            let dataSender = JSON.stringify({
                address: data.address,
                amount: parseInt(data.price)
            })
            console.log(dataSender)
            send(dataSender)

        })
    }).catch(err => {
        if (err.response !== undefined) {
            console.log(err.response.data)
        }
    })

//End send const Data


const buyButton = document.getElementById('buyBtn')
buyButton?.addEventListener('click', send);
async function getComponent() {
    const element = document.createElement('script');
    return element;
}

getComponent().then((component) => {
    document.body.appendChild(component);
});


