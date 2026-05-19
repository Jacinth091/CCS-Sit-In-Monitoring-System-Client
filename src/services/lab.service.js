import api from './backendConnection';

const labService = {
    getAll: async () => {
        const response = await api.get('lab/read.php');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('admin/labs/create.php', data);
        return response.data;
    },
    update: async (data) => {
        const response = await api.put('admin/labs/update.php', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete('admin/labs/delete.php', { data: { id } });
        return response.data;
    }
};

export default labService;
