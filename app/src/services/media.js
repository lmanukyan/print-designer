import axios from '@/services/axios'
import { Notify } from 'quasar'

const MediaService = {
    
  async upload(data){
    try{
      let result = await axios.post('media', data, {
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      return result.data.doc;
    } catch(e){
      Notify.create({ type: 'error', message: 'Не удалось загрузить файл на сервер.' });
      return false;
    }
  },

  async uploadBlob(blob){
    try{
      let data = new FormData()
      data.append('file', blob, 'capture.png')

      let result = await axios.post('media', data, {
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      return result.data.doc;
    } catch(e){
      Notify.create({ type: 'error', message: 'Не удалось загрузить файл на сервер.' });
      return false;
    }
  },
  
}

export default MediaService;