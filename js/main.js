class Main {
    constructor() {
        this.data = [];
        this.isLoading = false;
        this.hasMore = true;
        this.limit = 10;
    }

    async fetchAndDisplayPosts(page, limit = 10, searchQuery = '') {
        this.isLoading = true;
        const data = await apiService.fetchPosts(page, limit, searchQuery);
        this.isLoading = false;
        this.data = data;
        this.displayPosts(this.limit);
        this.hasMore = data.posts.length > 0;
    }

    displayPosts(limit) {
        const searchQuery = document.getElementById('search-input').value;
        const filteredPosts = this.data.posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.body.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const postContainer = document.getElementById('post-container');

        filteredPosts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <img src="https://via.placeholder.com/300x150" alt="Post Image">
                <h3>${post.title}</h3>
                <p>${post.body.substring(0, 100)}... <span class="read-more">See More</span></p>
                <p><strong>Views:</strong> ${post.views}</p>
                <p><strong>Likes:</strong> ${post.reactions.likes} --- <strong>Dislikes:</strong> ${post.reactions.dislikes}</p>
                <a href="#" class="more-details">More Details</a>
            `;
            postContainer.appendChild(postDiv);

            const readMore = postDiv.querySelector('.read-more');
            readMore.addEventListener('click', () => {
                readMore.parentElement.innerText = post.body;
            });
        });

        pagination.init(Math.ceil(this.data.total / limit));
    }

    async loadPosts() {
        const searchQuery = document.getElementById('search-input').value;
        const limit = parseInt(document.getElementById("pageLimit").value,10)
        await this.fetchAndDisplayPosts(pagination.currentPage, limit, searchQuery); // Limit set to 10 per page
    }

    infiniteScroller() {
        const postContainer = document.getElementById('post-container');
        postContainer.addEventListener('scroll', (event) => {
            let { clientHeight, scrollHeight, scrollTop } = event.target;
            const pageHeight = scrollHeight / pagination.getCuurentPage();
            const currentPage = Math.floor(scrollTop / pageHeight) + 1;

            // console.log(clientHeight,scrollHeight,scrollTop,pagination.getCuurentPage());
            if (!this.isLoading && this.hasMore) {
                // Forward scrolling logic
                if (clientHeight + scrollTop >= scrollHeight - 1) {
                    pagination.setPage(pagination.currentPage + 1);
                    this.loadPosts();
                }
                // Backward scrolling logic
                else if (scrollTop +clientHeight <= pageHeight * (pagination.currentPage - 1) && pagination.currentPage !== currentPage) {
                    pagination.setPage(currentPage);
                } 
            }
        });
    }

    init() {
        document.getElementById('search-input').addEventListener('input', () => this.loadPosts());
        this.loadPosts();
        this.infiniteScroller();
    }
}

const main = new Main();
main.init();