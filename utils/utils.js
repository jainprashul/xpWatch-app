/**
 * Convert Array of Objects to Array of Objects grouped by key
 * @param {Array} arr 
 * @param {String} property 
 * @returns Object grouped by property
 */
export function groupBy(arr, property) {
    return arr.reduce((acc, cur) => {
        acc[cur[property]] = [...acc[cur[property]] || [], cur];
        return acc;
    }, {});
}