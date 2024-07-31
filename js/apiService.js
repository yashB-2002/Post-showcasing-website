//! apiservice class to interect with other classes
class APIService extends BaseAPIService {
    async fetchPosts(page = 1, limit = 10, search = '') {
        const url = 'https://dummyjson.com/posts';
        const params = {
            skip: (page - 1) * limit,
            limit: limit,
            search: search
        };
        return await this.fetchData(url, params);
    }
}

const apiService = new APIService();


// https://dummyjson.com