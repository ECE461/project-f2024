//source: https://blog.logrocket.com/async-await-typescript/
// https://levelup.gitconnected.com/understand-async-await-in-typescript-in-only-a-few-minutes-dedb5a18a2c


// async function api_call (url: string): Promise{
//     const data: any = await fetch(url)
//     console.log(data)

// }


async function getDataHelper(url: string, arr: string[]){
    
    // const license_promise; 
    // const latency_promise; 
    // const busfac_promise; 
    // const responsive_promise; 
    // const rampup_promise;
    
    // loop over container over urls (strings) this should represent the data url that we need to pull for each
    // for each one, make a promise

    // const promise1 = fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    //     .then(response => response.json());

    

    // await Promise.allSettled([promise1])
    //     .then(
    //         (results) => {
    //             results.forEach((result, index) => {
    //                 if(result.status === 'fulfilled'){
                        
    //                     console.log(`Promise ${index + 1} fulfilled with value: ${result.value}.`);
    //                 }
    //                 else if (result.status === 'rejected'){
    //                     console.log(`Promise ${index + 1} rejected with reason: ${result.reason}`);
    //                 }
    //             });
    //         }
    //     )

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



// function fetchData(url: string): Promise<string> {
//     return new Promise<string>((resolve, reject) => {
//         fetch(url)
//             .then(response => {
//                 if (!response.ok) {
//                     reject(new Error('Network response was not ok (status ${response.status})'));
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log(data);
//                 resolve(data.message);
//             })
//             .catch(error => {
//                 reject(error);
//             });
//     });
// }



//Snippet 1
// const myAsynFunction = async (url: string): Promise<T> => {
//     const { data } = await fetch(url)
//     return data
// }

// //Snippet 2
// const immediatelyResolvedPromise = (url: string) => {
//     const resultPromise = new Promise((resolve, reject) => {
//         resolve(fetch(url))
//     })
//     return  resultPromise
// }