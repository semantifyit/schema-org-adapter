const CONSOLE_OUTPUT = false; // Change to "true" if you want to see console.log and console.error outputs for the tests

/**
 * console.log() output, only if CONSOLE_OUTPUT is set to "true" in file testUtility.js
 *
 * @param {string} out - the output string
 */
function debugFunc(out) {
    if (CONSOLE_OUTPUT === true) {
        console.log(out);
    }
}

/**
 * console.error() output, only if CONSOLE_OUTPUT is set to "true" in file testUtility.js
 *
 * @param {string} out - the output string
 */
function debugFuncErr(out) {
    if (CONSOLE_OUTPUT === true) {
        console.error(out);
    }
}

module.exports = {
    debugFunc,
    debugFuncErr
};
