import {heroData} from "./data";


/**
 * Returns the hero with the given `id`. Should "return" by
 * using the callback after 1.5s (1500ms). The first parameter of the callback should
 * be the hero and the second parameter should be the index where it was found.
 *
 * @param {array} heroData - just pass in the imported `heroData` from above
 * @param {number} id - Id of the hero to find
 * @param {function} callback - Callback function that should be used to return the data.
 */
export function getHeroByIdCallback(heroData, id, callback) {
    setTimeout(()=> {
        return callback(heroData.find(hero => hero.id === id), id);
    }, 1500);
}



//Below is code to help you get the right solution.

getHeroByIdCallback(heroData, 2, (hero) => {
    console.log(`Found the hero with id ${hero.id}`, hero);
});

getHeroByIdCallback(heroData, 4, (hero, index) => {
   console.log(`hero with id ${hero.id} found at index ${index}`);
});


