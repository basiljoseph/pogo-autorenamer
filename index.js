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

async function openMenu() {
    console.log('Opening menu')
    await sendInputToDevice('tap ' + config.menu[0] + ' ' + config.menu[1]);
    return delay(config.sleep);
}

async function openAppraisal() {
    console.log('Opening Apraisal Menu')
    await sendInputToDevice('tap ' + config.appraisal[0] + ' ' + config.appraisal[1]);
    return delay(config.sleep);
}

async function skipAppraisal() {
    console.log('Skipping Pre Apraisal')
    await sendInputToDevice('tap ' + config.skipAppraisal[0] + ' ' + config.skipAppraisal[1]);
    return delay(config.sleep);
}


function swipeRightCoOrdinates() {
    console.log('Swiping to Right')
    return '' + config.rightSideCoOrdinate[0] + ' ' + config.rightSideCoOrdinate[1] + ' ' + config.leftSideCoOrdinate[0] + ' ' + config.leftSideCoOrdinate[1]
}

function swipeLeftCoOrdinates() {
    console.log('Swiping to Left')
    return '' + config.leftSideCoOrdinate[0] + ' ' + config.leftSideCoOrdinate[1] + ' ' + config.rightSideCoOrdinate[0] + ' ' + config.rightSideCoOrdinate[1]
}

async function gotoNextPokemon() {
    console.log('Going to Next pokemon')
    await sendInputToDevice('swipe ' + swipeRightCoOrdinates());
    return delay(config.sleep);
}

async function gotoPrevPokemon() {
    console.log('Going to Previous pokemon')
    await sendInputToDevice('swipe ' + swipeLeftCoOrdinates());
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
    for (let sets = 0; sets < config.maxRename / config.maxCache; sets++) {
        await openMenu();
        await openAppraisal();
        await skipAppraisal();

        /*First cache the pokemons appraisal */
        for (let cache = 0; cache < config.maxCache; cache++) {
            await gotoNextPokemon();
        }
        /* Go back to the first cached pokemon */
        for (let cache1 = 0; cache1 < config.maxCache; cache1++) {
            await gotoPrevPokemon();
        }

        /* Dismiss the appraisal screen */
        await skipAppraisal();

        for (let cache2 = 0; cache2 < config.maxCache; cache2++) {
            await renamePokemon();
            await gotoNextPokemon();
        }
    }
}

renamePokemons()