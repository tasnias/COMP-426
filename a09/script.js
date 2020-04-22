let loadedTweets = [];

//done
export const handleTweetButtonPress = function (event) {
    //toggle is-active class
    const $modal = $('.modal')
    $modal.html(`<div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Write your tweet</p>
            <button class="delete cancel-btn" aria-label="close"></button>
        </header>
        <form id='write-tweet'>
        <section class="modal-card-body">
                <textarea class='textarea' name='body'></textarea>
        </section>
        <section class="modal-card-foot">
            <button class="button is-info" id="send-tweet-btn" type="submit">Send Tweet</button>
            <button class="button cancel-btn is-white">Cancel</button>
        </section>
        </form>
        </div>`)
    $modal.addClass('is-active');
}

//done
export const handleCancelButtonPress = function (event) {
    event.preventDefault();
    const $modal = $('.modal')
    $modal.removeClass('is-active');
}

//done
export const handleSendTweet = async function (event) {
    // sent post request and exit modal
    event.preventDefault();
    let body = $(`#write-tweet`).serializeArray();
    body = (body[0].value);

    let response = await axios({
        method: 'POST',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets`,
        withCredentials: true,
        data: {
            body: body
        }
    });

    let tweet = response.data;
    loadedTweets.push(tweet);
    renderTweet(tweet, $('#tweets'), 'prepend');

    handleCancelButtonPress(event);
}

//done
export const handleRetweetButtonPress = function (event) {
    let id = JSON.parse(event.currentTarget.dataset.id);
    let tweet = loadedTweets.find((tweet) =>
        tweet.id === id);
    const $modal = $('.modal');
    $modal.html(`<div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Retweet?</p>
            <button class="delete cancel-btn" aria-label="close"></button>
        </header>
        <form id='retweet-${id}'>
        <section class="modal-card-body">
            <header>
                <div class='avi'>
                    ${tweet.author.substring(0, 1)}${tweet.author.substring(tweet.author.length - 2, tweet.author.length - 1)}
                </div>
                <span class='author'>${tweet.author}</span>
                <span class='date'>${new Date(tweet.updatedAt).toISOString().substring(0, 16)}</span>
            </header>
            <div class='body'>
                ${tweet.body}
            </div>  
            <textarea class='textarea' name='body'></textarea>

        </section>

        <section class="modal-card-foot">
            <button class="button is-info" id="send-retweet-btn" data-id='${tweet.id}' type="submit">Retweet</button>
            <button class="button cancel-btn is-white">Cancel</button>
        </section>
        </form>
    </div>`)
    $modal.addClass('is-active');
}

// TODO: handle retweet count change
export const handleSendRetweet = async function (event) {
    event.preventDefault();
    let id = JSON.parse(event.currentTarget.dataset.id);
    let index = loadedTweets.findIndex((tweet) =>
        tweet.id === id);
    let tweet = loadedTweets[index];
    let body = $(`#retweet-${id}`).serializeArray();
    body = (body[0].value);
    let response = await axios({
        method: 'POST',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": tweet.id,
            "body": `${body != undefined ? body + ` <b>RT@${tweet.author}:</b> ` : ''}${tweet.body}`,
        },
    });
    loadedTweets.push(response.data);
    $(`#${id} .retweet-btn`).html(
        `<button>
            <span class="icon has-text-info">
                <i class="fas fa-retweet"></i>
            </span>
        </button>
        <span class='likeCount'>${loadedTweets[index].retweetCount + 1}</span>`);

    handleCancelButtonPress(event);
    renderTweet(response.data, $('#tweets'), 'prepend');
}

export const handleLikeButtonPress = async function (event) {
    let id = JSON.parse(event.currentTarget.dataset.id);
    let index = loadedTweets.findIndex((tweet) => tweet.id === id);
    if (loadedTweets[index].isLiked) {
        event.currentTarget.innerHTML = `<button>
        <span class="icon">
            <i class="far fa-heart"></i>
        </span>
        </button>
        <span class='likeCount'>${loadedTweets[index].likeCount}</span>`;
        await axios({
            method: 'PUT',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/unlike`,
            withCredentials: true
        });
    }

    else {
        event.currentTarget.innerHTML = `<button>
        <span class="icon has-text-danger">
            <i class="fas fa-heart"></i>
        </span>
        </button>
        <span class='likeCount'>${loadedTweets[index].likeCount + 1}</span>`;
        await axios({
            method: 'PUT',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/like`,
            withCredentials: true
        });
    }

    //TODO: get original tweet reference
    loadedTweets[index].isLiked = !loadedTweets[index].isLiked;
}

export const handleEditButtonPress = function (event) {
    let id = JSON.parse(event.currentTarget.dataset.id);
    let tweet = loadedTweets.find((tweet) => tweet.id === id);
    const $modal = $('.modal')
    $modal.html(`<div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Edit your tweet</p>
            <button class="delete cancel-btn" aria-label="close"></button>
        </header>
        <form id='edit-${id}'>
        <section class="modal-card-body">
                <textarea class='textarea' name='body'>${tweet.body}</textarea>
        </section>
        <section class="modal-card-foot">
            <button class="button is-info" id="send-edit-btn" data-id=${tweet.id}>Save Tweet</button>
            <button class="button cancel-btn is-white">Cancel</button>
        </section>
        </form>

        </div>`)
    $modal.addClass('is-active');
}

export const handleSendEdit = async function (event) {
    event.preventDefault();
    let id = JSON.parse(event.currentTarget.dataset.id);

    let body = $(`#edit-${id}`).serializeArray();
    body = (body[0].value);

    await axios({
        method: 'PUT',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
        data: {
            body: body
        }
    });

    $(`#${id} .body`).text(body);

    handleCancelButtonPress(event);
}

export const handleReplyButtonPress = function (event) {
    let id = JSON.parse(event.currentTarget.dataset.id);
    let tweet = loadedTweets.find((tweet) =>
        tweet.id === id);
    const $modal = $('.modal')
    $modal.html(`<div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Reply to ${tweet.author}</p>
            <button class="delete cancel-btn" aria-label="close"></button>
        </header>
        <form id='reply-${id}'>

        <section class="modal-card-body">
            <header>
                <div class='avi'>
                    ${tweet.author.substring(0, 1)}${tweet.author.substring(tweet.author.length - 2, tweet.author.length - 1)}
                </div>
                <span class='author'>${tweet.author}</span>
                <span class='date'>${new Date(tweet.updatedAt).toISOString().substring(0, 10)}</span>
            </header>

            <div class='body'>
                ${tweet.body}
            </div>  
            <textarea class='textarea' name='body'></textarea>
        </section>
        <section class="modal-card-foot">
            <button class="button is-info" id="send-reply-btn" type="submit" data-id=${tweet.id}>Reply</button>
            <button class="button cancel-btn is-white">Cancel</button>
        </section>
        </form>
        </div>`)
    $modal.addClass('is-active');
}

export const handleSendReply = async function (event) {
    event.preventDefault();
    let id = JSON.parse(event.currentTarget.dataset.id);
    let index = loadedTweets.findIndex((tweet) =>
    tweet.id === id);
    let body = $(`#reply-${id}`).serializeArray();
    body = (body[0].value);

    await axios({
        method: 'POST',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets`,
        withCredentials: true,
        data: {
            'body': body,
            'type': 'reply',
            'parent': id
        }
    });

    $(`#${id} .reply-btn`).html(
        `<button>
        <span class="icon">
            <i class="far fa-comment-dots"></i>
        </span>
    </button>
    ${loadedTweets[index].replyCount + 1}`);

    handleCancelButtonPress(event);
}

export const handleDeleteButtonPress = function (event) {
    let id = JSON.parse(event.currentTarget.dataset.id);
    const $modal = $('.modal')
    $modal.html(`<div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Delete your tweet?</p>
            <button class="delete cancel-btn" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
            Your tweet won't be able to be recovered.
        </section>
        <section class="modal-card-foot">
            <button class="button is-danger" id="send-delete-btn" data-id="${id}">Delete Tweet</button>
            <button class="button cancel-btn is-white">Cancel</button>
        </section>
    </div>`)
    $modal.addClass('is-active');
}

export const handleSendDelete = async function (event) {
    let id = JSON.parse(event.currentTarget.dataset.id);
    //  let tweet = loadedTweets.find((tweet) => tweet.id === id);
    await axios({
        method: 'DELETE',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });

    //remove from array

    //remove from DOM
    $(`#${id}`).remove();

    //update retweet and count lengths of parents 

    handleCancelButtonPress(event);
}

export const handleToggleThread = async function (event) {
    let id = parseInt(event.currentTarget.dataset.id);
    let tweet = loadedTweets.find((tweet) =>
        tweet.id === id);
    let state = event.currentTarget.dataset.state;
    if (state === 'hidden') {
        event.currentTarget.dataset.state = 'showing'
        event.currentTarget.innerHTML = `Hide replies`;
    }
    else if (state === 'showing') {
        event.currentTarget.dataset.state = 'hidden'
        event.currentTarget.innerHTML = `Show replies`;
    }
    // let replies = await axios({
    //     method: 'GET',
    //     url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
    //     params: {
    //         where: { type: ['reply'], parentId: id },
    //     },
    //     withCredentials: true,
    // });

}

export const renderTimeline = function () {
    //render first 50 tweets
    renderTweets();

    // attach handler for tweet button
    $('body').on('click', '#tweet', handleTweetButtonPress);
    $('body').on('click', '#send-tweet-btn', handleSendTweet);
    $('body').on('click', '.cancel-btn', handleCancelButtonPress);

    // attach handler to like, retweet, reply, show thread buttons 
    $('body').on('click', '.retweet-btn', handleRetweetButtonPress);
    $('body').on('click', '#send-retweet-btn', handleSendRetweet);
    $('body').on('click', '.reply-btn', handleReplyButtonPress);
    $('body').on('click', '#send-reply-btn', handleSendReply);
    $('body').on('click', '.like-btn', handleLikeButtonPress);
    $('body').on('click', '.edit-btn', handleEditButtonPress);
    $('body').on('click', '#send-edit-btn', handleSendEdit);
    $('body').on('click', '.delete-btn', handleDeleteButtonPress);
    $('body').on('click', '#send-delete-btn', handleSendDelete);
    $('body').on('click', 'a', handleToggleThread);

    $(window).scroll(function () {
        // End of the document reached?
        if ($(document).height() - $(this).height() < $(this).scrollTop() + 100) {
            renderTweets();
        }
    });
}

export const renderTweet = function (tweet, $tweet, method) {
    let tweetTemplate =
        `<div class='tweet' id=${tweet.id}>
            ${tweet.type === 'retweet' ?
            `<div id='rt'>
                <span class="icon" >
                    <i class="fas fa-retweet"></i>
                </span>
                &nbsp;
                    Retweeted
            </div>` :
            ''}
            <header>
                <div class='header-left-stuff'>
                    <div class='avi'>
                        ${tweet.author.substring(0, 1)}${tweet.author.substring(tweet.author.length - 2, tweet.author.length - 1)}
                    </div>
                    <span class='author'>
                        ${tweet.author}
                    </span>
                    <span class='date'>
                        ${new Date(tweet.updatedAt).toISOString().substring(0, 16)}
                    </span>
                </div>    
                <div class="dropdown is-hoverable ${tweet.isMine === true ? '' : 'is-hidden'}">
                    <div class="dropdown-trigger">
                        <button class="button is-white" aria-haspopup="true" aria-controls="dropdown-menu4">
                        <span class="icon is-small">
                        <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                        <div class="dropdown-content">
                            <div class="dropdown-item">
                                <button class="button is-white delete-btn" data-id='${tweet.id}' aria-haspopup="true" aria-controls="dropdown-menu4">
                                    <span class="icon">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        <div class="dropdown-item">
                            <button class="button is-white edit-btn" data-id='${tweet.id}' aria-haspopup="true" aria-controls="dropdown-menu4">
                                <span class="icon">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class='body'>
            ${tweet.body}
        </div>

        <footer>
            <span class='like-btn' data-id='${tweet.id}'>
                <button>
                    <span class="icon ${tweet.isLiked === true ? 'has-text-danger' : ""}">
                        <i class="${tweet.isLiked === true ? 'fas fa-heart' : "far fa-heart"}"></i>
                    </span>
                </button>
                <span class='likeCount'>${tweet.likeCount}</span>
            </span>
            <span class='reply-btn' data-id='${tweet.id}'>
                <button>
                    <span class="icon">
                        <i class="far fa-comment-dots"></i>
                    </span>
                </button>
                ${tweet.replyCount}
            </span>
            <span class='retweet-btn' data-id='${tweet.id}'>
                <button>
                    <span class="icon">
                        <i class="fas fa-retweet"></i>
                    </span>
                </button>
                <span class='retweetCount'>${tweet.retweetCount}</span>
            </span>
            <br>
            ${tweet.replies != undefined ? `<a data-id="${tweet.id}" data-state="hidden">Show replies</a>` : ''}

        </footer>
    </div>`;
    if (method === 'prepend') {
        $tweet.prepend(tweetTemplate);
    }
    else {
        $tweet.append(tweetTemplate);
    }
}

export const renderTweets = async function () {
    // fetch next 50 tweets
    let newTweets = await axios({
        method: 'GET',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        params: {
            skip: loadedTweets.length,
        },
        withCredentials: true,
    });
    const $tweets = $('#tweets');
    newTweets = newTweets.data;

    newTweets.forEach((tweet) => {
        if (loadedTweets.findIndex(existingTweet => tweet.id === existingTweet.id) === -1) {
            renderTweet(tweet, $tweets, 'append');
            loadedTweets.push(tweet);
        }
    });
}

$(function () {
    renderTimeline();
});

