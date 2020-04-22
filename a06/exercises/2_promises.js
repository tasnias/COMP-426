import { heroData } from "./data";


/**
 * This function does the same thing as getHeroByIdCallback() did---that is, it
 *   simulates an asynchronous search operation that takes 1.5 seconds. However,
 *   getHeroByIdPromise() does not accept a callback function; instead, it
 *   should return a Promise object which resolves after 1.5 seconds (1500 ms).
 *   Use the Promise `reject` functionality to return an error if no hero could
 *   be found with the requested id.
 *
 * @param {Array} heroData  The array of hero data to search. For us, this will
 *                          simply be the imported `heroData` from above.
 * @param {Number} id  The id of the hero to find
 * @returns {Promise<object>}  A new Promise object that either resolves after
 *                             1.5 seconds with the correct hero or rejects
 *                             after 1.5 seconds if no hero could be found
 */
export function getHeroByIdPromise(heroData, id) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            let hero = heroData.find(hero => hero.id === id);
            if (hero != undefined) {
                resolve(hero);
            }

            else {
                reject(new Error('error!!'));
            }
        }, 1500);
    });
}

//Below is code to help you get the right solution.
/*
const hero2 = getHeroByIdPromise(heroData, 2)
    .then(hero => {
        console.log(`Found the hero with id ${hero.id}`, hero);
    })
    .catch(error => {
        console.log(error);
    });
console.log(`logging hero2 and should be a promise ${hero2}`);


const heroError = getHeroByIdPromise(heroData, 20)
    .then(hero => {
        console.log(`Found the hero with id ${hero.id}`, hero);
    })
    .catch(error => {
        console.log(error);
    });
*/
