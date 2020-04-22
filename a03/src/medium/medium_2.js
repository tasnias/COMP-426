import mpg_data from "./data/mpg_data";
import { getStatistics, getSum } from "./medium_1";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: {
        highway: getSum(mpg_data.map((car) => car['highway_mpg'])) / mpg_data.length,
        city: getSum(mpg_data.map((car) => car['city_mpg'])) / mpg_data.length,
    },
    allYearStats: getStatistics(mpg_data.map((car) => car['year'])),
    ratioHybrids: mpg_data.reduce((sum, car) => (car['hybrid'] === true) ? sum += 1 : sum, 0) / mpg_data.length,
};


/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export const moreStats = {
    makerHybrids: getMakerHybrids()
        .filter((el) => el['hybrids'].length > 0)
        .sort((a, b) => b['hybrids'].length - a['hybrids'].length),
    avgMpgByYearAndHybrid: getAvgMpgByYearAndHybrid()
};

console.log(moreStats['makerHybrids'])

function getMakerHybrids() {
    return mpg_data.reduce((currentObject, car) => {
        let make = car['make'];
        if (car['hybrid'] === true) {
            if (getMakeIndex(make, currentObject) == -1) {
                currentObject.push({
                    make,
                    hybrids: []
                })
            }
            currentObject[getMakeIndex(make, currentObject)]['hybrids'].push(car['id']);
        }

        return currentObject;
    }, []);
}

function getMakeIndex(make, currentObject) {
    for (let i = 0; i < currentObject.length; i++) {
        if (currentObject[i]['make'] === make)
            return i;
    }

    return -1;
}

function getAvgMpgByYearAndHybrid() {
    let data = mpg_data.reduce((currentObject, car) => {
        let year = car['year'];
        if (currentObject[year] === undefined)
            currentObject[year] = {
                hybrid: {
                    highway: [],
                    city: []
                },
                notHybrid: {
                    highway: [],
                    city: []
                }
            };
        
            if (car['hybrid'] === true) {
                currentObject[year]['hybrid']['highway'].push(car['highway_mpg']);
                currentObject[year]['hybrid']['city'].push(car['city_mpg']);
            }

            else {
                currentObject[year]['notHybrid']['highway'].push(car['highway_mpg']);
                currentObject[year]['notHybrid']['city'].push(car['city_mpg']);
            }
        return currentObject;
    }, {});

    (Object.keys(data)).forEach(year => {
        (Object.keys(data[year])).forEach(carType => {
            (Object.keys(data[year][carType])).forEach(mpgType => {
                data[year][carType][mpgType] = getSum(data[year][carType][mpgType]) / data[year][carType][mpgType].length;
            })
        })
    });

    return data;
}