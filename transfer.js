"use strict";

const
    config = require('./config'),
    { promisify } = require('util'),
    execCb = require('child_process').exec,
    exec = promisify(execCb)

function delay(t, val) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(val);
        }, t);
    });
}

function sendInputToDevice(args) {
    var cmd = config.adbPath + ' shell input ' + args
    console.log('Executing ' + cmd)
    return exec(cmd);
}


async function gotoNextPokemon() {
    console.log('Going to Next pokemon')
    await sendInputToDevice('tap ' + config.nextTransfer[0] + ' ' + config.nextTransfer[1]);
    await delay(config.sleep);
}

async function trasferPokemon() {
    console.log('Opening menu')
    await sendInputToDevice('tap ' + config.menu[0] + ' ' + config.menu[1]);
    await delay(config.sleep);

    console.log('Selecting Transfer')
    await sendInputToDevice('tap ' + config.transfer[0] + ' ' + config.transfer[1]);
    await delay(config.sleep);

    console.log('Confirm Transfer')
    await sendInputToDevice('tap ' + config.transferConfirmation[0] + ' ' + config.transferConfirmation[1]);
    await delay(config.sleep);

    console.log('Confirm Mythical transfer')
    await sendInputToDevice('tap ' + config.mythicalConfirmation[0] + ' ' + config.mythicalConfirmation[1]);
    return delay(config.sleep*2);
}

async function transferPokemons() {
    for (let count = 0; count < config.maxTransfer; count++) {
        await trasferPokemon();
        await gotoNextPokemon();
    }
}

transferPokemons()