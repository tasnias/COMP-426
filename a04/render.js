/**
 * Course: COMP 426
 * Assignment: a04
 * Author: <type your name here>
 *
 * This script uses jQuery to build an HTML page with content taken from the
 * data defined in data.js.
 */



/**
 * Given a hero object (see data.js), this function generates a "card" showing
 *     the hero's name, information, and colors.
 * @param hero  A hero object (see data.js)
 */
export const renderHeroCard = function (hero) {
    // TODO: Generate HTML elements to represent the hero
    // TODO: Return these elements as a string, HTMLElement, or jQuery object
    // Example: return `<div>${hero.name}</div>`;
    return `
        <div class="section" style="background-color:${hero.backgroundColor}; color: ${hero.color}">
            <div class='container'>
                <div class='content'>
                    <h2 class="title" style="color:${hero.color};">${hero.first} ${hero.last}             
                        <button class='button'>Edit</button>
                    </h2>
                    <h3 class='subtitle is-italic' style="color:${hero.color};">${hero.name}, ${hero.subtitle}</h3>
                    <h4 class='subtitle has-text-weight-normal' style="color:${hero.color};">First Seen: <span class='is-italic'>${hero.firstSeen.getMonth()} ${hero.firstSeen.getFullYear()}</span></h4>
                    <div class='has-text-centered'>
                        <img src="${hero.img}">
                        <p>${hero.description}</p>
                    </div>
                </div>
            </div> 
        </div>
    `;
};



/**
 * Given a hero object, this function generates a <form> which allows the
 *     user to edit the fields of the hero. The form inputs should be
 *     pre-populated with the initial values of the hero.
 * @param hero  The hero object to edit (see data.js)
 */
export const renderHeroEditForm = function (hero) {
    // TODO: Generate HTML elements to represent the hero edit form
    // TODO: Return these elements as a string, HTMLElement, or jQuery object
    // Example: return `<form>${hero.name}</form>`;
    return `
        <form class="section" style="background-color:${hero.backgroundColor}; color: ${hero.color}">
            <div class='container'>
                <div class='content'>
                    <div class="field">
                        <label class="label" style="color: ${hero.color}">First Name</label>
                        <div class="control">
                        <input class="input" value="${hero.first}">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" style="color: ${hero.color}">Last Name</label>
                        <div class="control">
                            <input class="input" value="${hero.last}">
                        </div>
                    </div>
                    
                    <div class="field">
                        <label class="label" style="color: ${hero.color}">Hero Name</label>
                        <div class="control">
                            <input class="input" value="${hero.name}">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" style="color: ${hero.color}">Description</label>
                        <textarea class="textarea">${hero.description}</textarea>
                    </div>

                    <div class="field">
                        <label class="label" style="color: ${hero.color}" for="start" name='firstSeen'>Last Seen</label>
                        <input type="date" class='input' id="start" name="firstSeen"
                            value="${hero.firstSeen.toISOString().substring(0, 10)}"
                            min="2010-01-01" max="2020-12-31">
                    </div>


                    <div class="field">
                        <div class="control">
                            <button class='button' type='submit'>Save</button>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                        <button class='button'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div> 
        </form>
    `;
};



/**
 * Given an array of hero objects, this function converts the data into HTML and
 *     loads it into the DOM.
 * @param heroes  An array of hero objects to load (see data.js)
 */
export const loadHeroesIntoDOM = function (heroes) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');

    // TODO: Generate the heroes using renderHeroCard()
    for (let i = 0; i < heroes.length; i++) {
        $root.append(renderHeroCard(heroes[i]));
    }
    // TODO: Append the hero cards to the $root element
    // Pick a hero from the list at random
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    $root.append(renderHeroEditForm(randomHero));
    // TODO: Generate the hero edit form using renderHeroEditForm()

    // TODO: Append the hero edit form to the $root element
};



/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function () {
    loadHeroesIntoDOM(heroicData);
});


var Bar = function (a, b) {
    if (a > b) {
        this.a = a - b;
        this.m1 = function () {
            return this.b * a;
        }
    } else {
        this.b = b - a;
        this.m2 = function () {
            return this.a / b;
        }
    }
}

Bar.prototype.m1 = function () {
    return this.a * this.b;
} 

Bar.prototype.m2 = function () {
    return this.a / this.b;
} 

var Foo = function (a, b) {
    this.a = a;
    this.b = b;
    Bar.prototype.a = a + b;
    Bar.prototype.b = a - b;
    Bar.prototype.m1 = Bar.prototype.m2; 
    Bar.prototype.m2 = function () {
        console.log(this.a, a, this.b, b,  this.a * a + this.b * b);
        return this.a * a + this.b * b;
    }
}

Foo.prototype.m1 = Bar.prototype.m1; 
Foo.prototype.m2 = Bar.prototype.m2; 

let o1 = new Bar(1, 5);
let o2 = new Foo(2, 3);
let o3 = new Bar(5, 1);
let o4 = new Foo(3, 2);

let r1 = o1.m1();
let r2 = o1.m2();
let r3 = o2.m1();
let r4 = o3.m1();
let r5 = o3.m2();
console.log(o3.m2);