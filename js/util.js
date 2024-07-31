function createElement(tag, className, innerHTML = '') {
    const element = document.createElement(tag);
    element.className = className;
    element.innerHTML = innerHTML;
    return element;
}

function createPostHTML(post) {
    return `
        <img src="https://via.placeholder.com/300x150" alt="Post Image">
        <h3>${post.title}</h3>
        <p>${post.body.substring(0, 100)}... <span class="read-more">See More</span></p>
        <p><strong>Views:</strong> ${post.views}</p>
        <p><strong>Likes:</strong> ${post.reactions.likes} --- <strong>Dislikes:</strong> ${post.reactions.dislikes}</p>
        <a href="#" class="more-details">More Details</a>
    `;
}

function addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
}
