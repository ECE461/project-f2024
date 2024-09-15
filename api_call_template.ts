//source: https://blog.logrocket.com/async-await-typescript/
// https://levelup.gitconnected.com/understand-async-await-in-typescript-in-only-a-few-minutes-dedb5a18a2c

async function getDataHelper(url: string, arr: string[]){
    //DRAFT 2
    const results = await Promise.allSettled([
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => response.json()),
        fetch('https://jsonplaceholder.typicode.com/posts/invalid-url').then(response => response.json()),
        fetch('https://jsonplaceholder.typicode.com/posts/3').then(response => response.json())
    ]);

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index + 1} fulfilled with value:`, result.value);
        } else {
            console.log(`Promise ${index + 1} rejected with reason:`, result.reason);
        }
    });
}



async function getData(url: string) {
    var arr = new Array<string>();

    //container for urls?????
    // getDataHelper(url, arr);
    console.log(await getDataHelper(url, arr)); 
}

getData('hello');

