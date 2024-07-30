class Main {
    constructor() {
        this.data = [];
        this.isLoading = false;
        this.hasMore = true;
    }

    async fetchAndDisplayPosts(page, limit = 10, searchQuery = '') {
        this.isLoading = true;
        const data = await apiService.fetchPosts(page, limit, searchQuery);
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

        pagination.init(Math.ceil(this.data.total / 10));
    }

    async loadPosts() {
        console.trace('lodingposrt')
        const searchQuery = document.getElementById('search-input').value;
        await this.fetchAndDisplayPosts(pagination.currentPage, 10, searchQuery); 
    }

    infiniteScroller() {
        const postContainer = document.getElementById('post-container');
        const pagePositions = new Map(); 
        let lastScrollTop = 0; 
    
        postContainer.addEventListener('scroll', (event) => {
            let { clientHeight, scrollHeight, scrollTop } = event.target;
    
            if (!pagePositions.has(pagination.currentPage)) {
                pagePositions.set(pagination.currentPage, scrollTop);
            }
    
            let currentPage = pagination.currentPage;
            for (let [page, position] of pagePositions.entries()) {
                if (scrollTop >= position) {
                    currentPage = page;
                } else {
                    break;
                }
            }
    
            if (!this.isLoading && this.hasMore) {
                // Forward scrolling logic
                if (scrollTop > lastScrollTop && clientHeight + scrollTop >= scrollHeight - 1) {
                    pagination.setPage(pagination.currentPage + 1);
                    this.loadPosts();
                }
            }
    
            // Backward scrolling logic
            if (scrollTop < lastScrollTop) {
                if (pagination.currentPage !== currentPage) {
                    pagination.setPage(currentPage);
                    // alert('success')
                    // const pageButtonsContainer = document.getElementById('page-buttons');
                    // const buttons = pageButtonsContainer.getElementsByClassName('page-btn');

                    // for (const button of buttons) {
                    //     button.classList.remove('active');
                    //     if (parseInt(button.dataset.page, 10) === pagination.currentPage) {
                    //         button.classList.add('active');
                    //     }
                    // }
                    this.updateUIForCurrentPage(pagination.currentPage)
                }
            }
    
            lastScrollTop = scrollTop;
        });
    }

    updateUIForCurrentPage(page) {
        // Implement the logic to update the UI based on the current page
        const pageButtonsContainer = document.getElementById('page-buttons');
        const buttons = pageButtonsContainer.getElementsByClassName('page-btn');

        for (const button of buttons) {
            button.classList.remove('active');
            if (parseInt(button.dataset.page, 10) === page) {
                button.classList.add('active');
            }
        }
    }
    

    init() {
        document.getElementById('search-input').addEventListener('input', () => this.loadPosts());
        this.loadPosts();
        this.infiniteScroller();
    }
}

const main = new Main();
main.init();

