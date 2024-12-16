import axios from "axios";

class apiService {
    axios_get = async (path, params = {}) => {
        return axios.get(path, { params });
    };

    axios_post = async (path, data = {}, config = {}) => {
        return axios.post(path, data, config);
    };

    axios_put = async (path, data = {}, params = {}, config = {}) => {
        return axios.put(path, data, { params, ...config });
    };

    axios_delete = async (path, params = {}, config = {}) => {
        return axios.delete(path, { params, ...config });
    };
}

export const ApiService = new apiService();
