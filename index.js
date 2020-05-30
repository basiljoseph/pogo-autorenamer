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

function swipeRightCoOrdinates() {
    console.log('Swiping to Right')
    return '' + config.rightSideCoOrdinate[0] + ' ' + config.rightSideCoOrdinate[1] + ' ' + config.leftSideCoOrdinate[0] + ' ' + config.leftSideCoOrdinate[1]
}

async function gotoNextPokemon() {
    console.log('Going to Next pokemon')
    await sendInputToDevice('swipe ' + swipeRightCoOrdinates());
    return delay(config.sleep);
}

async function getAppraisal() {
    console.log('Opening menu')
    await sendInputToDevice('tap ' + config.menu[0] + ' ' + config.menu[1]);
    await delay(config.sleep);

    console.log('Opening Apraisal Menu')
    await sendInputToDevice('tap ' + config.appraisal[0] + ' ' + config.appraisal[1]);
    await delay(config.sleep);

    console.log('Skipping Pre Apraisal')
    await sendInputToDevice('tap ' + config.skipAppraisal[0] + ' ' + config.skipAppraisal[1]);
    await delay(config.sleep);

    console.log('Skipping Apraisal')
    await sendInputToDevice('tap ' + config.skipAppraisal[0] + ' ' + config.skipAppraisal[1]);
    return delay(config.sleep);
}

async function renamePokemon() {

    console.log('Renaming Pokemon')
    await sendInputToDevice('tap ' + config.rename[0] + ' ' + config.rename[1]);
    await delay(config.sleep);

    /* Clear the existing name */
    console.log('Clearing name')
    await sendInputToDevice('keyevent --longpress  KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL');
    await delay(config.sleep);

    /* Paste the name from clipboard */
    console.log('Pasting Name')
    await sendInputToDevice('keyevent 279');
    await delay(config.sleep);

    /* Click OK on keyboard */
    console.log('Clicking OK on keyboard')
    await sendInputToDevice('tap ' + config.okKeyboard[0] + ' ' + config.okKeyboard[1]);
    await delay(config.sleep);

    /* Click OK on PoGo */
    console.log('Clicking OK on PoGo')
    await sendInputToDevice('tap ' + config.okPoGo[0] + ' ' + config.okPoGo[1]);
    return delay(config.sleep * 2);
}

async function renamePokemons() {
    for (let count = 0; count < config.maxRename; count++) {
        await getAppraisal();
        await renamePokemon();
        await gotoNextPokemon();
    }
}

renamePokemons()