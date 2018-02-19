<template>
    <app v-loading.fullscreen.lock="loading"></app>
</template>



<script>

import App from '~/components/App'
import {mapState} from 'vuex'


export default {
  middleware:'auth',
  data(){
    return{
      loading:false
    }
  },
  head () {
    return {
      title: this.total_unread > 0 ? "(" + this.total_unread + ") OpenTrip":"OpenTrip",
      meta: [
        { hid: 'description', name: 'description', content: 'OpenTrip Web client for chat' }
      ]
    }
  },
  computed:{
    ...mapState([
      'authenticated',
      'total_unread',
      'current_chat'
    ])
  },
  components:{
      App
  },
  methods:{
    init(){

      this.$store.commit('SET_ROOM_NOW',0)
      this.$store.commit('SET_UNREAD_COUNT',0)
      this.$initSocket();

      this.$socket.on('connect', function(){

      });
      this.$socket.on('success', (data)=>{
         this.$socket.on(`new_message:${data.user.id}`,(chat)=>{
            if(this.current_chat._id === chat._id){
                 this.$store.commit('JUST_UPDATE',chat);
            }else{
                console.log('add',chat)
              this.$store.commit('PLUS_UNREAD',chat.unread_count);
              this.$store.commit('ADD_OR_UPDATE_CHAT',chat);
            }
         });
         this.$store.commit('SET_USER',data.user);
      });
      this.$socket.on('error', (data)=>{
/*
          this.$store.commit('SET_AUTH',false);
          this.$store.dispatch('logOut');
          window.location.reload()*/
      });


      this.$socket.on('disconnect',()=>{
        this.$message({
          message: 'discconnect',
          showClose: true,
          type: 'error'
        });
      });


    }
  },
  created(){
      try{
          this.init()
      }catch(err){
          this.init()
      }
  }

}
</script>
