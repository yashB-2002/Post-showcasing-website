class APIService {
    constructor() {
        if (!APIService.instance) {
            this.cache = {};
            APIService.instance = this;
        }
        return APIService.instance;
    }

    async fetchPosts(page = 1, limit = 10, search = '') {

        // to maintain a cache to prevent api calling for already fetched data
        const cacheKey = `${page}-${limit}-${search}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        // api call
        const response = await fetch(`https://dummyjson.com/posts?skip=${(page - 1) * limit}&limit=${limit}&search=${search}`);
        const data = await response.json();
        this.cache[cacheKey] = data; //cache addition
        return data;
    }
}

const apiService = new APIService();


// https://dummyjson.com