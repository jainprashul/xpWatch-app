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


export function debounce(fn , delay=300){
    let timer = null;
    return function(){
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(this, arguments);
        }, delay);
    }
}

export const debouncePromise = (fn, ms = 0) => {
    let timeoutId;
    const pending = [];
    return (...args) =>
      new Promise((res, rej) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const currentPending = [...pending];
          pending.length = 0;
          Promise.resolve(fn.apply(this, args)).then(
            data => {
              currentPending.forEach(({ resolve }) => resolve(data));
            },
            error => {
              currentPending.forEach(({ reject }) => reject(error));
            }
          );
        }, ms);
        pending.push({ resolve: res, reject: rej });
      });
  };

  export function generateRandomColor(opacity=1){
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 
    ${Math.floor(Math.random() * 256)}, ${opacity})`;
  }

  export const convertToDate = (day , month , year) => {
    return new Date(year, month, day);
  }