class Main {
    constructor() {
        this.data = [];
        this.isLoading = false;
        this.hasMore = true;
        this.pagePositions = new Map();
        this.limit = 10; // default limit
    }

    async fetchAndDisplayPosts(page, searchQuery = '') {
        this.isLoading = true;
        console.log(`Fetching posts: page=${page}, limit=${this.limit}, searchQuery=${searchQuery}`);
        console.log(`length of data is ${this.data.length}`);
        console.trace()
        // Fetching posts with current limit
        const data = await apiService.fetchPosts(page, this.limit, searchQuery);
        this.isLoading = false;
        this.data = data; // Update data with new fetched posts
        this.displayPosts();
        this.hasMore = data.posts.length > 0;
        pagination.updateTotalPages(data.total); // Updating pagination with new total pages
    }

    displayPosts() {
        const searchQuery = document.getElementById(commonID.searchInput).value;
        const filteredPosts = this.data.posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.body.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const postContainer = document.getElementById(commonID.postContainer);

        filteredPosts.forEach(post => {
            const postDiv = createElement('div', 'post');
            postDiv.innerHTML = createPostHTML(post);
            postContainer.appendChild(postDiv);

            const readMore = postDiv.querySelector('.read-more');
            if (readMore) {
                addEventListener(readMore, 'click', () => {
                    readMore.parentElement.innerText = post.body;
                });
            }
        });
    }

    async loadPosts() {
        const searchQuery = document.getElementById(commonID.searchInput).value;
        await this.fetchAndDisplayPosts(pagination.currentPage, searchQuery); 
    }

    infiniteScroller() {
        const postContainer = document.getElementById(commonID.postContainer);
        let lastScrollTop = 0;

        postContainer.addEventListener('scroll', (event) => {
            let { clientHeight, scrollHeight, scrollTop } = event.target;

            if (!this.pagePositions.has(pagination.currentPage)) {
                this.pagePositions.set(pagination.currentPage, scrollTop);
            }

            let currentPage = pagination.currentPage;
            for (let [page, position] of this.pagePositions.entries()) {
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
                    this.updateUIForCurrentPage(pagination.currentPage);
                }
            }

            // updating the scroll top position
            lastScrollTop = scrollTop;
        });
    }

    updateUIForCurrentPage(page) {
        const pageButtonsContainer = document.getElementById(commonID.pageButtons);
        const buttons = pageButtonsContainer.getElementsByClassName('page-btn');

        for (const button of buttons) {
            button.classList.remove('active');
            if (parseInt(button.dataset.page, 10) === page) {
                button.classList.add('active');
            }
        }
    }

    scrollToPagePosition(page) {
        const postContainer = document.getElementById(commonID.postContainer);
        if (this.pagePositions.has(page)) {
            const position = this.pagePositions.get(page);
            postContainer.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        }
    }

    init() {
        // Listen for changes to the page limit
        document.getElementById('pageLimit').addEventListener('change', (event) => {
            this.limit = parseInt(event.target.value, 10);
            console.log(`Page limit changed to ${this.limit}`);
            this.pagePositions.clear(); 
            pagination.setPage(1); 
            document.getElementById("post-container").innerHTML = '' // before loading post with new limit clear the post with previous meeting
            this.loadPosts(); // Reload posts with new limit
        });

        addEventListener(document.getElementById(commonID.searchInput), 'input', () => this.loadPosts());
        this.loadPosts();
        this.infiniteScroller();
    }
}

const main = new Main();
main.init();
