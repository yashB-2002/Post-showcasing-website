class BaseAPIService {
    constructor() {
        if (!BaseAPIService.instance) {
            this.cache = {};
            BaseAPIService.instance = this;
        }
        return BaseAPIService.instance;
    }

    async fetchData(url, params = {}) {
        const cacheKey = this.generateCacheKey(url, params);
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${url}?${queryString}`);
        const data = await response.json();
        this.cache[cacheKey] = data;
        return data;
    }

    generateCacheKey(url, params) {
        return `${url}-${JSON.stringify(params)}`;
    }
}
