/**
 * Created by muharizals on 04/10/2017.
 */
import axios from 'axios'
import * as Cookies from 'js-cookie'
import {BASE_URL,HEADERS,QISCUS_BASE_URL,QISCUS_SECRET,SOCKET_CHAT} from './config.env'

export const state = () =>({
  user:{
    profile_picture: 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
  },
  authenticated:false,
  chat:[],
  showWelcome:true,
  room:0,
  total_unread:0,
  current_chat:{}
})



export const mutations = {
  SET_CURRENT_CHAT:function (state,chat) {
    state.current_chat = chat
    state.showWelcome = false;
  },
  SET_USER: function (state,user) {
    state.user = user
  },
  SET_AUTH:function (state,auth) {
    state.authenticated = auth
  },
  SET_CHAT:function (state,chat) {
    state.chat = chat
  },
  SET_UNREAD_COUNT:function (state,count) {
    state.total_unread= count
  },
  PLUS_UNREAD:function (state,count) {
    state.total_unread = state.total_unread + count
  },
  PUSH_CHAT:(state,items)=>{
    items.forEach((item)=>{
        state.total_unread = state.total_unread + item.unread_count
        state.chat.push(item)
    })
  },
  SET_WELCOME:function (state,show) {
    state.showWelcome = show
  },
  SET_ROOM_NOW:function (state,no_room) {
    state.room = no_room
    if(no_room != 0 ){
      let index = state.chat.findIndex((itm)=>itm.room_id == no_room)
      if(index > -1){
        state.total_unread = state.total_unread - state.chat[index].unread_count;
        state.chat[index].unread_count = 0;
      }
    }
  },
  JUST_UPDATE:function (state,data) {
    let index = state.chat.findIndex((itm)=>itm._id === data._id)
    if(index > -1){
      state.chat[index].last_message = data.last_message
      state.chat[index].last_message_date = data.last_message_date;
      state.chat[index].unread_count = 0;
      if(index !== 0){
        let removed = state.chat.splice(index,1)
        state.chat.unshift(removed[0])
      }
    }
  },
  UPDATE_UNREAD_COUNT:function (state,id) {
    let index = state.chat.findIndex((itm)=>itm._id === id);
    if(index > -1){
      let total = state.total_unread - state.chat[index].unread_count;
      if(total < 0){
        this.state.total_unread = 0;
      }else{
        this.state.total_unread = total;
      }
      state.chat[index].unread_count = 0;
    }
  },
  ADD_OR_UPDATE_CHAT:function (state,data) {
    let index = state.chat.findIndex((itm)=>itm._id === data._id)
    if(index > -1){
      state.chat[index].last_message = data.last_message
      state.chat[index].last_message_date = data.last_message_date
      state.chat[index].unread_count = data.unread_count;
      if(state.current_chat._id === data._id){
        state.chat[index].unread_count = 0
      }
      if(index !== 0){
        let removed = state.chat.splice(index,1)
        state.chat.unshift(removed[0])
      }

    }else{
      state.chat.unshift(data)
    }
  }
}

export const getters = {
  isAuthenticated (state) {
    return state.authenticated
  },
  user(state){
    return state.user
  },
  room(state){
    return state.room
  },
  socket(state){
    return state.socket
  }
}

export const actions = {
  async login({commit},{email,password}){
    try{
      const {data} = await axios.post(BASE_URL+"user/login",{
        email,password
      },HEADERS)
      if(data.error){
        throw {message:data.message}
      }
      if(!data.error){
        Cookies.set('token',data.data.access_token,{ expires: 7 });
        commit('SET_USER',data.data)
        commit('SET_AUTH',true)
      }else{
        throw {message:"Terjadi kesalahan tidak diketahui"}
      }
    }catch (error){
      throw error
    }
  },
  async loadContactMessage({commit},{user_email,page}){
      try{
        const {data} = await axios.get(BASE_URL + "chat/get_user_rooms",{
          params:{
            email:user_email,
          },
          headers:HEADERS.headers
        })

        if(data.error){
          throw {message:data.message}
        }
        if(!data.error){
          commit('PUSH_CHAT',data.data.results.rooms_info)
        }else{
          throw {message:"Terjadi kesalahan tidak diketahui"}
        }

      }catch (error){
        throw error
      }
  },
  logOut({commit}){
    commit('SET_AUTH',false)
    commit('SET_CHAT',[])
    Cookies.remove('token');
  }
}
