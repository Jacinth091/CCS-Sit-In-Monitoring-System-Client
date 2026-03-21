import api from './backendConnection';

const labService = {
    getAll: async () => {
        const response = await api.get('lab/read.php');
        return response.data;
    }
};

export default labService;
