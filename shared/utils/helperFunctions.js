/**
 * @template {Object} T
 * @param {T} obj 
 * @returns {Readonly<T>}
 */
const deepFreeze = function(obj) {
    const propNames = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < propNames.length; i++) {
        const propName = propNames[i];
        const value = obj[propName];
        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return Object.freeze(obj);
}

/**
 * 
 * @param {number} stop 
 * @param {number} start 
 * @param {number} step 
 * @returns 
 */
const getRandomInt = (stop, start = 0, step = 1) => Math.floor(Math.random() * (stop - start) / step) * step + start;

/**
 * 
 * @param {Array} arr 
 * @returns 
 */
const getRandomElement = arr => arr[getRandomInt(arr.length)];

export { deepFreeze, getRandomInt, getRandomElement };