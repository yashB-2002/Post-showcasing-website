class Pagination {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.updatePageInfo();
        this.addEventListeners();
    }

    updatePageInfo() {
        document.getElementById('page-info').innerText = `Page ${this.currentPage}`;
        document.getElementById('prev-btn').disabled = this.currentPage === 1;
        document.getElementById('next-btn').disabled = this.currentPage === this.totalPages;
    }

    setPage(page) {
        if (page < 1) page = 1; // going below page 1 not allowed
        if (page > this.totalPages) page = this.totalPages; // going above total pages not allowed
        this.currentPage = page;
        this.updatePageInfo();
        main.loadPosts();
    }

    addEventListeners() {
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.setPage(this.currentPage );
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.setPage(this.currentPage);
            }
        });
    }

    init(totalPages) {
        this.totalPages = totalPages;
        this.updatePageInfo();
    }
}

const pagination = new Pagination();
