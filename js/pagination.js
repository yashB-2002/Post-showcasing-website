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
        this.renderPaginationButtons();
        this.scrollToActiveButton(); // to make active button in view
        main.scrollToPagePosition(page); // to scroll to saved position
    }


    // adding event listeners on the next and prev
    addEventListeners() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.addEventListener('click', (event) => {
            if (event.target.id === 'prev-btn') {
                this.setPage(this.currentPage - 1);
                main.loadPosts();
            }
            if (event.target.id === 'next-btn') {
                this.setPage(this.currentPage + 1);
                main.loadPosts();
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

        // dynamically generate the buttons
        for (let i = 1; i <= this.totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'page-btn';
            pageButton.innerText = i;
            pageButton.dataset.page = i;
            if (i === this.currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                this.setPage(i);
                main.loadPosts();
            });
            pageButtonsContainer.appendChild(pageButton);
        }
    }

    // scrolling to active button to handle the horizontal scrollabr position according to the user's view
    scrollToActiveButton() {
        const activeButton = document.querySelector('.page-btn.active');
        if (activeButton) {
            activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }
}

const pagination = new Pagination();
