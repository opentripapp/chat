<template>
  <div class="chat">
    <chat-box-header :data="current_chat"></chat-box-header>
    <chat-list :data="current_chat"></chat-list>
    <chat-input :data="current_chat"></chat-input>
  </div>
</template>

<script>
  import ChatBoxHeader from '~/components/ChatBoxHeader'
  import ChatList from '~/components/ChatList'
  import ChatInput from '~/components/ChatInput'
  import {mapState} from 'vuex'

  export default{
    computed: mapState([
      'current_chat'
    ]),
    components:{
      ChatBoxHeader,
      ChatList,
      ChatInput
    },
    watch: {
      current_chat(newData, oldData) {
        if(oldData._id){
           this.leave_room(oldData._id);
        }
        if(newData._id){
           this.join_room(newData._id);
        }
      }
    },
    data(){
        return {

        }
    },
    methods: {
      join_room(name){
          this.$socket.emit('join_room', name)
      },
      leave_room(){
        this.$socket.emit('leave_room', name)
      }
    },
    beforeMount(){
      if(this.current_chat._id){
        this.join_room(this.current_chat._id);
      }
    }

}
</script>

<style>
  .chat{
    width: 100%;
    height:100%;
    background-color: #f7f9fa
  }
</style>
