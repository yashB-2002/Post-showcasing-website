// to rate limit the api calls
function throttle(fn, wait) {
    let timeout = null;
    return function (...args) {
        if (!timeout) {
            timeout = setTimeout(() => {
                fn.apply(this, args);
                timeout = null;
            }, wait);
        }
    };
}
class Main {
    // Store fetched data here
    data = [];
    isLoading = false; // Track if data is currently being loaded
    hasMore= true;  // Flag to determine if there's more data to load

    async fetchAndDisplayPosts(page, searchQuery = '') {

        this.isLoading = true;
        const data = await apiService.fetchPosts(page, 10, searchQuery);
        this.isLoading = false;
        this.data = data;
        this.displayPosts();
        this.hasMore = data.posts.length > 0; 
    }


    
    displayPosts() {
        const searchQuery = document.getElementById('search-input').value;
        const filteredPosts = this.data.posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.body.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const postContainer = document.getElementById('post-container'); // post container to hold all the posts        

        // this code for implementing the search query
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

        // this is for calculating the total pages to hold all the data and initialize the pagination component with the initial values
        pagination.init(Math.ceil(this.data.total / 10));
    }

    // to call the display post for current page
    async loadPosts() {
        const searchQuery = document.getElementById('search-input').value;
        await this.fetchAndDisplayPosts(pagination.currentPage, searchQuery);
    }

    infiniteScroller() {
        window.addEventListener('scroll', throttle(() => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
                
                // loading of new post is done when the tootltip is near the bottom not exactly touched
                if (!this.isLoading && this.hasMore) {
                    pagination.setPage(pagination.currentPage + 1);
                    this.loadPosts(); 
                }
            }
        }, 300)); 
    }

    init() {
        this.loadPosts();
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', throttle(() => {
            pagination.setPage(1); // when search input is called page is set to 1 as searching is done page wise
            this.loadPosts();
        }, 300)); 

        this.infiniteScroller();

        // Initialize pagination buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (pagination.currentPage > 1) {
                pagination.setPage(pagination.currentPage - 1);
                this.loadPosts();
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            if (pagination.currentPage < pagination.totalPages) {
                pagination.setPage(pagination.currentPage + 1);
                this.loadPosts();
            }
        });
    }
};

// Execute when all the content in the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Main().init();
});

const main = new Main()