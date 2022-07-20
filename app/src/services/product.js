import axios from '@/services/axios'
import { Notify } from 'quasar'

const ProductService = {

  async getModel(id) {
    try {
      let result = await axios.get(`products/${id}`);
      return result.data;
    } catch (e) {
      return false;
    }
  },

  async getModels(userId = null) {
    try {
      let result = await axios.post('products/models', { userId });
      return result.data.docs;
    } catch (e) {
      return false;
    }
  },

  async create(data) {
    try {
      let result = await axios.post('products', data);
      Notify.create({ type: 'success', message: 'Успещно создан.' });
      return result.data.doc;
    } catch (e) {
      Notify.create({ type: 'error', message: 'Произошла ошибка. Повторите попытку позже.' });
      return false;
    }
  },

  async delete(id) {
    try {
      let result = await axios.delete(`products/${id}`);
      Notify.create({ type: 'success', message: 'Модель успещно удалена.' });
      console.log('delete: ', result);
      return true;
    } catch (e) {
      console.log('error:create: ', e);
      Notify.create({ type: 'error', message: 'Произошла ошибка. Повторите попытку позже.' });
      return false;
    }
  },


}

export default ProductService;