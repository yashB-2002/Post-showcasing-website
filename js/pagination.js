class Pagination {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.addEventListeners();
    }

    updatePageInfo() {
        document.getElementById('prev-btn').disabled = this.currentPage === 1;
        document.getElementById('next-btn').disabled = this.currentPage === this.totalPages;
    }

    setPage(page) {
        if (page < 1) page = 1;
        if (page > this.totalPages) page = this.totalPages;
        this.currentPage = page;
        this.updatePageInfo();
        main.loadPosts();
    }

    getCuurentPage() {
        return this.currentPage
    }
    addEventListeners() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.addEventListener('click', (event) => {
            if (event.target.id === 'prev-btn') {
                this.setPage(this.currentPage - 1);
                
            }
            if (event.target.id === 'next-btn') {
                this.setPage(this.currentPage + 1);
            }
        });
    }

    init(totalPages) {
        this.totalPages = totalPages;
        this.renderPaginationButtons();
        this.updatePageInfo();
    }

    renderPaginationButtons() {
        const pageButtonsContainer = document.getElementById('page-buttons');
        pageButtonsContainer.innerHTML = '';

        for (let i = 1; i <= this.totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'page-btn';
            pageButton.innerText = i;
            pageButton.dataset.page = i;
            if (i === this.currentPage) {
                pageButton.classList.add('active');
            }
            pageButtonsContainer.appendChild(pageButton);
        }
    }
}

const pagination = new Pagination();
