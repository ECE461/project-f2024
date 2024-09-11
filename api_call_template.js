"use strict";
//source: https://blog.logrocket.com/async-await-typescript/
// https://levelup.gitconnected.com/understand-async-await-in-typescript-in-only-a-few-minutes-dedb5a18a2c
// async function api_call (url: string): Promise{
//     const data: any = await fetch(url)
//     console.log(data)
// }
function fetchData(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
            if (!response.ok) {
                reject(new Error('Network response was not ok (status ${response.status})'));
            }
            return response.json();
        })
            .then(data => {
            console.log(data);
            resolve(data.message);
        })
            .catch(error => {
            reject(error);
        });
    });
}
fetchData("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
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
