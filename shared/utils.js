/**
 * @template {Object} T
 * @param {T} obj 
 * @returns {T}
 */
export function deepFreeze(obj) {
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