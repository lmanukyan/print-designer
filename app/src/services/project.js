import axios from '@/services/axios'
import { Notify } from 'quasar'

const ProjectService = {

  async getProject(id) {
    try {
      let result = await axios.get(`projects/${id}`);
      return result.data;
    } catch (e) {
      return false;
    }
  },

  async getProjects() {
    try {
      let result = await axios.get('projects?mini');
      return result.data.docs;
    } catch (e) {
      return false;
    }
  },

  async create(data) {
    try {
      let result = await axios.post('projects', data);
      Notify.create({ type: 'success', message: 'Успещно создан.' });
      return result.data.doc;
    } catch (e) {
      Notify.create({ type: 'error', message: 'Произошла ошибка. Повторите попытку позже.' });
      return false;
    }
  },

  async update(id, data) {
    try {
      let result = await axios.put(`projects/${id}`, data);
      let title = result.data.doc.title;
      Notify.create({ type: 'success', message: `Проект «${title}» успещно обновлен.` });
      return result.data.doc;
    } catch (e) {
      Notify.create({ type: 'error', message: 'Произошла ошибка. Повторите попытку позже.' });
      return false;
    }
  },

  async delete(id) {
    try {
      let result = await axios.delete(`projects/${id}`);
      Notify.create({ type: 'success', message: 'Успещно удалена.' });
      console.log('delete: ', result);
      return true;
    } catch (e) {
      console.log('error:create: ', e);
      Notify.create({ type: 'error', message: 'Произошла ошибка. Повторите попытку позже.' });
      return false;
    }
  },


}

export default ProjectService;