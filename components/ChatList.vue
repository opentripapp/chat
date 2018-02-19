<template>
  <div ref="container" class="chatlist-panel-body-box bg_list" v-chat-scroll @scroll-top="loadChat()" v-loading="loading">
    <div class="bf-msg">
      <chat-message v-for="(data,index) in dataMessage" :key="index" :data="data" :before="dataMessage[index-1]" :chat="chat"></chat-message>
    </div>
  </div>
</template>

<script>
  import ChatMessage from '~/components/ChatMessage'
  import {mapState} from 'vuex'
  export default{
    components:{
      ChatMessage
    },
    computed:mapState([
      'user'
    ]),
    props: ['data'],
    watch: {
      data(newData, oldData) {
        this.$socket.off(`room_new_message:${oldData._id}`)
        this.init();
        this.firstInit();
        this.chat = newData;
      }
    },
    data(){
        return{
            loading:true,
            dataMessage:[],
            busy: false,
            notEnd:true,
            options:{
              chat_id:'',
              offset:0,
              limit:20
            },
            chat:this.data
        }
    },
    methods:{
        loadChat(){
            if(!this.notEnd || this.busy){
                return;
            }
            this.busy = true;
            this.$socket.emit('get_list_message',this.options,(result)=>{
                this.busy = false
                if(!result.error && result.data){
                  if(result.data.length === 0){
                      this.notEnd = false;
                  }else{
                    result.data = result.data.reverse();
                    this.dataMessage = result.data.concat(this.dataMessage) ;
                    this.options.offset = this.options.offset + this.options.limit;
                    this.$refs.container.scrollTop =this.$refs.container.scrollHeight/4;
                  }
                }
            })
        },
        firstInit(){
          this.busy = true;
          this.$socket.emit('get_list_message',this.options,(result)=>{
              this.loading = false;
            this.busy = false
              if(!result.error && result.data){
                if(result.data.length === 0){
                  this.notEnd = false;
                }else{
                  result.data = result.data.reverse();
                  this.dataMessage = result.data.concat(this.dataMessage) ;
                  this.options.offset = this.options.offset + this.options.limit;
                }
              }
          });

          this.$socket.on(`room_new_message:${this.data._id}`,(data)=>{
              this.dataMessage.push(data);
              if(data.from._id !== this.user.id){
                  this.setAsRead();
              }
          });

          if(this.data.unread_count > 0){
              this.setAsRead();
          }
        },
        init(){
          this.loading = true
          this.dataMessage = []
          this.busy = false
          this.notEnd = true
          this.options.chat_id = this.data._id;
          this.options.offset = 0;
          this.options.limit = 20;
        },
        setAsRead(){
          this.$socket.emit(`set_as_read`,{chat_id:this.data._id});
          this.$store.commit('UPDATE_UNREAD_COUNT',this.data._id);
        }
    },
    mounted(){

    },
    beforeMount(){
        this.init();
        this.firstInit();
    },
    beforeDestroy(){

    }
  }
</script>

<style>
  .bf-msg{
    display: flex;
    flex-flow: column;
    list-style: none;
    margin: 0;
    padding: 15px;
  }
  .chatlist-panel-body-box {
    display: -webkit-flex;
    display: flex;
    position: relative;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    height: calc(100% - 114px);
    background-color: #fefefe;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1;
  }

  .bg_list{
    background: #efe7dd url('~/static/img/bg_chat.jpg') repeat;
  }
</style>
