import api from './backendConnection';

const courseService = {
  getCourses: () => 
    api.get('course/read.php').then(r => r.data)
};

export default courseService;
