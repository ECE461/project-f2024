//source: https://blog.logrocket.com/async-await-typescript/
// https://levelup.gitconnected.com/understand-async-await-in-typescript-in-only-a-few-minutes-dedb5a18a2c

/**
 * Stuff with  more arguments.
 * @method getData: asynchronous function that creates the dictionary and sends it to the helper
 * @param {string} url: api url path
 * @param {string} arr: concatenate all values from results.json into arr
 */
async function getDataHelper(url: string, arr: string[]){
    
    //create a large promise. wait until it finishes before proceeding with the following code
    const results = await Promise.allSettled([
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => response.json()),
        fetch('https://jsonplaceholder.typicode.com/posts/invalid-url').then(response => response.json()),
        fetch('https://jsonplaceholder.typicode.com/posts/3').then(response => response.json())
    ]);

    //disp results.json {WILL CHANGE TO COMPUTATIONS}
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index + 1} fulfilled with value:`, result.value);
        } else {
            console.log(`Promise ${index + 1} rejected with reason:`, result.reason);
        }
    });

    //for testing purposes, arr has not been used. there is no dictionary type in tsc, so we're still figuring that out
}


/**
 * Stuff with  more arguments.
 * @method getData: asynchronous function that creates the dictionary and sends it to the helper
 * @param {string} url: api url path
 */

async function getData(url: string) {
    var arr = new Array<string>(); 

    //print to console for now. change return value later if needed. await is needed so getData doesn't terminate
    //before getDataHelper finishes
    console.log(await getDataHelper(url, arr)); 
}

getData('hello');

