class Main {
    constructor() {
        this.data = [];
        this.isLoading = false;
        this.hasMore = true;
        this.pagePositions = new Map();
    }

    async fetchAndDisplayPosts(page, limit = 10, searchQuery = '') {
        this.isLoading = true;
        const data = await apiService.fetchPosts(page, limit, searchQuery);
        this.isLoading = false;
        this.data = data;
        this.displayPosts();
        this.hasMore = data.posts.length > 0;
    }

    // displaypost on page
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
            addEventListener(readMore, 'click', () => {
                readMore.parentElement.innerText = post.body;
            });
        });

        pagination.init(Math.ceil(this.data.total / 10));
    }

    async loadPosts() {
        const searchQuery = document.getElementById(commonID.searchInput).value;
        await this.fetchAndDisplayPosts(pagination.currentPage, 10, searchQuery); 
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

    // updating the button state ie. active or not
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

    // this is for changing the scrolltip postion according to the currentpage position
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
        addEventListener(document.getElementById(commonID.searchInput), 'input', () => this.loadPosts());
        this.loadPosts();
        this.infiniteScroller();
    }
}

const main = new Main();
main.init();
