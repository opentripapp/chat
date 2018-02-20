/**
 * Created by muharizals on 15/02/2018.
 */
import io from 'socket.io-client'
import Cookies from 'js-cookie'
import {SOCKET_CHAT} from '../store/config.env'
import Vue from 'vue'

const SocketIoPlugin = {
  install:(Vue)=>{
    Vue.prototype.$initSocket =function () {
      Vue.prototype.$socket = io(
        `${SOCKET_CHAT}`,
         {
           query:`auth_token=${Cookies.get('token')}`,
           transports: ['websocket'],
           path:'/v2/chat'
         }
        );
    }
  }
}

Vue.use(SocketIoPlugin)

