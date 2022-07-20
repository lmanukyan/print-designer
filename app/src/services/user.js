import axios from '@/services/axios'
import { Notify } from 'quasar'

const UserService = {

  async getProfile() {
    try {
      let result = await axios.get('users/me');
      return result.data.user;
    } catch (e) {
      localStorage.removeItem('accessToken');
      return false;
    }
  },

  async login(email, password) {
    try {
      let result = await axios.post('users/login', {
        email,
        password
      });

      localStorage.setItem('accessToken', result.data.token);
      Notify.create({ type: 'success', message: 'Вы успешно авторизованы.' });

      return result.data.user;
    } catch (e) {
      Notify.create({ type: 'error', message: 'Неверный email или пароль.' });
      return false;
    }
  },

  async register(name, email, password) {
    try {
      await axios.post('users', {
        name,
        email,
        password
      });
      return this.login(email, password);
    } catch (e) {
      Notify.create({ type: 'error', message: 'Пользователь с таким email уже существует.' });
      return false;
    }
  },

  async logout() {
    await axios.post('users/logout');
    localStorage.removeItem('accessToken');
  },

}

export default UserService;