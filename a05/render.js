/**
 * Course: COMP 426
 * Assignment: a05
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
    // TODO: Copy your code from a04 to render the hero card
    hero.description = hero.description.replace(/'/g, '&#x27;')
    return `
        <div class="section" id='${hero.id}' style="background-color:${hero.backgroundColor}; color: ${hero.color}">
            <div class='container'>
                <div class='content'>
                    <h2 class="title" style="color:${hero.color};">${hero.first} ${hero.last}             
                        <button class='button edit-btn' data-hero='${JSON.stringify(hero)}'>Edit</button>
                    </h2>
                    <h3 class='subtitle is-italic' style="color:${hero.color};">${hero.name}, ${hero.subtitle}</h3>
                    <h4 class='subtitle has-text-weight-normal' style="color:${hero.color};">First Seen: <span class='is-italic'>${hero.firstSeen.getMonth()} ${hero.firstSeen.getFullYear()}</span></h4>
                    <div class='has-text-centered'>
                        <img src="${hero.img}">
                        <p>${hero.description.replace(/'/g, "\u0027")}</p>
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
    // TODO: Copy your code from a04 to render the hero edit form
    hero.description = hero.description.replace(/'/g, '&#x27;')
    // console.log(hero.firstSeen)
    return `
        <form class="section" id='${hero.id}' style="background-color:${hero.backgroundColor}; color: ${hero.color}">
            <div class='container'>
                <div class='content'>
                    <div class="field">
                        <label class="label" style="color: ${hero.color}">First Name</label>
                        <div class="control">
                        <input class="input" name='first' value="${hero.first}">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" style="color: ${hero.color}" >Last Name</label>
                        <div class="control">
                            <input class="input" name='last' value="${hero.last}">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" style="color: ${hero.color}">Hero Name</label>
                        <div class="control">
                            <input class="input" name='name' value="${hero.name}">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" style="color: ${hero.color}" >Description</label>
                        <textarea class="textarea" name='description'>${hero.description}</textarea>
                    </div>

                    <div class="field">
                        <label class="label" style="color: ${hero.color}" for="start" name='firstSeen'>First Seen</label>
                        <input type="date" class='input' id="start" name="firstSeen"
                            value="${hero.firstSeen.toISOString().substring(0, 10)}"
                            min="1900-01-01" max="2020-12-31">
                    </div>


                    <div class="field">
                        <div class="control">
                            <button class='button 
                            save-btn'
                            data-hero='${JSON.stringify(hero)}'
                            type='submit'>Save</button>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                        <button class='button cancel-btn' 
                        data-hero='${JSON.stringify(hero)}'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div> 
        </form>
    `;
};



/**
 * Handles the JavaScript event representing a user clicking on the "edit"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleEditButtonPress = function (event) {
    // TODO: Render the hero edit form for the clicked hero and replace the
    //       hero's card in the DOM with their edit form instead
    let hero = JSON.parse(event.target.dataset.hero);

    let parsed = parseInt((hero.firstSeen).substring(5,7));
    if (parsed == 0)
        parsed = '12';
    else if (parsed < 10)
        parsed = `0${parsed}`;

    console.log(hero.firstSeen);
    console.log(new Date(hero.firstSeen.replace(/-\d\d-/, `-${parsed}-`)));

    hero.firstSeen = new Date(hero.firstSeen.replace(/-\d\d-/, `-${parsed}-`));
    let heroCard = $(`#${hero.id}`);
    heroCard.replaceWith(renderHeroEditForm(hero));
};



/**
 * Handles the JavaScript event representing a user clicking on the "cancel"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleCancelButtonPress = function (event) {
    // TODO: Render the hero card for the clicked hero and replace the
    //       hero's edit form in the DOM with their card instead
    let hero = JSON.parse(event.target.dataset.hero);
    hero.firstSeen = new Date(hero.firstSeen);
    let heroCard = $(`#${hero.id}`);
    heroCard.replaceWith(renderHeroCard(hero));
};



/**
 * Handles the JavaScript event representing a user clicking on the "cancel"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleEditFormSubmit = function (event) {
    // TODO: Render the hero card using the updated field values from the
    //       submitted form and replace the hero's edit form in the DOM with
    //       their updated card instead

    let hero = JSON.parse(event.target.dataset.hero);
    let heroCard = $(`#${hero.id}`);
    let id = null;
    let inputs = $(`#${hero.id}`).serializeArray();
    let i;
    for (i = 0; i < heroicData.length; i++) {
        if (heroicData[i].id === hero.id)
            id = i;
    }

    let year = parseInt(inputs[4]['value'].substring(0, 4));
    let month = parseInt(inputs[4]['value'].substring(5, 7));
    let date = parseInt(inputs[4]['value'].substring(8, 10))
    // console.log(`${year} ${month} ${date}`);
    // console.log(new Date(year, month - 1, date));
    heroicData[id].first = inputs[0]['value'];
    heroicData[id].last = inputs[1]['value'];
    heroicData[id].name = inputs[2]['value'];
    heroicData[id].description = inputs[3]['value'];
    heroicData[id].firstSeen = new Date(year, month -1, date);
    heroCard.replaceWith(renderHeroCard(heroicData[id]));
};



/**
 * Given an array of hero objects, this function converts the data into HTML,
 *     loads it into the DOM, and adds event handlers.
 * @param  heroes  An array of hero objects to load (see data.js)
 */
export const loadHeroesIntoDOM = function (heroes) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');

    // TODO: Generate the heroes using renderHeroCard()
    //       NOTE: Copy your code from a04 for this part

    for (let i = 0; i < heroes.length; i++) {
        // TODO: Append the hero cards to the $root element
        $root.append(renderHeroCard(heroes[i]));
    }

    // TODO: Use jQuery to add handleEditButtonPress() as an event handler for
    //       clicking the edit button
    $root.on('click', '.edit-btn', handleEditButtonPress);
    // TODO: Use jQuery to add handleEditFormSubmit() as an event handler for
    //       submitting the form
    $root.on('click', '.cancel-btn', handleCancelButtonPress);

    // TODO: Use jQuery to add handleCancelButtonPress() as an event handler for
    //       clicking the cancel button
    $root.on('click', '.save-btn', handleEditFormSubmit);
};



/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function () {
    heroicData.forEach((hero) => {
        hero.description = hero.description.replace(/'/g, '&#x27;')
    })
    loadHeroesIntoDOM(heroicData);
});
