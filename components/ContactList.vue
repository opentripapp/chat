<template>
  <div class="chatlist-panel-body"
       v-infinite-scroll="loadChatList"
       infinite-scroll-disabled="busy"
       infinite-scroll-immediate-check="notEnd"
       infinite-scroll-throttle-delay="500"
       infinite-scroll-distance="20" v-loading="loadingSide">
    <chat-item v-for="item in chat" :key="item._id" :item="item" @click.native="openChat(item)"></chat-item>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import ChatItem from '~/components/ChatItem'

  export default{
    components:{
        ChatItem
    },
    props:{
      search: {
        type: String,
        default: ''
      },
    },
    computed: {
      filteredItems() {
          try{
            return this.chat.filter(item => {
              return item.room_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
            })
          }catch (error){
              return []
          }

      },
        ...mapState([
        'chat'
      ])
    },
    data(){
      return {
        loadingSide:true,
        busy: false,
        notEnd:true,
        list:[],
        options:{
            offset:0,
            limit:20
        }
      }
    },
    methods:{
      openChat(item){
        this.$store.commit('SET_CURRENT_CHAT',item);
      },
      loadChatList(){
          if(!this.notEnd){
              return;
          }
        try{
          this.busy = true
          this.$socket.emit('get_list_chat',this.options,(result)=>{
            this.busy = false
            this.loadingSide =false
              if(result.error){
                return this.$message({
                  message: result.message || 'unknown error',
                  showClose: true,
                  type: 'error'
                });
              }
             if(result.data.length === 0){
                 this.notEnd = false;
             }else{
               this.options.offset = this.options.offset + this.options.limit;
               this.$store.commit('PUSH_CHAT',result.data)
             }
          });

        }catch (error){
          this.busy = false;
          this.loadingSide =false
          this.$message({
            message: error.message,
            showClose: true,
            type: 'error'
          });
        }
      }
    },
    beforeMount(){
      this.$store.commit('SET_WELCOME',true)
      let datas = []
      this.$store.commit('SET_CHAT',datas)
      this.loadChatList();
    }
  }
</script>

<style>
  .chatlist-panel-body {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    height: calc(100% - 110px);
    background-color: #fefefe;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1;
  }
</style>
