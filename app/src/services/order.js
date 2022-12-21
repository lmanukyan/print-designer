import axios from '@/services/axios'
import { Notify } from 'quasar'

const OrderService = {

  async getPrices() {
    try {
      let result = await axios.get('globals/pricing');
      return result.data;
    } catch (e) {
      return false;
    }
  },

  async create(data) {
    try {
      let result = await axios.post('orders?depth=0', data);
      // Notify.create({ type: 'orderSuccess', message: 'Спасибо, ваша заявка принята! Мы свяжемся с вами в ближайшее время' });
      return result.data.doc;
    } catch (e) {
      Notify.create({ type: 'error', message: 'Произошла ошибка. Повторите попытку позже.' });
      return false;
    }
  },

}

export default OrderService;