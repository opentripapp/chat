<template>
  <div class="row sideBar-body" >
    <el-col :span="4" class="col-sm-3 col-xs-3 sideBar-avatar">
      <div class="avatar-icon">
        <img  :src="getPhoto()">
      </div>
    </el-col>
    <el-col :span="20" class="col-sm-9 col-xs-9 sideBar-main">
      <el-row  class="row">
        <el-col :span="16" class="col-sm-8 col-xs-8 sideBar-name">
          <span v-if="item.type == 'group'" class="name-meta">{{item.title}}</span>
          <span v-if="item.type == 'private'" class="name-meta">{{item.from.name}}</span>
        </el-col>
        <el-col :span="8" class="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span class="time-meta pull-right">{{getDate(item.last_message_date)}}
                  </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" class="sideBar-message">
            <span v-if="!is_action" class="message_meta">
             {{item.last_message}}
            </span>
           <span v-if="is_action" class="chat_action">
             {{action_message}}
            </span>
        </el-col>
        <el-col :span="4" >
          <el-badge  :value="item.unread_count" :max="99" class="item">

          </el-badge>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>

<script>
  import moment from 'moment'
  export default{
    props:['item'],
    data(){
      return {
          is_action:false,
          action_message:'no action',
      }
    },
    methods:{
      getPhoto(){
        if(this.item.type === 'private'){
            return this.item.from.profile_picture || 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
        }
        if(this.item.type === 'group'){
            if(this.item.photo.small_file_url === 'none'){
                return 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
            }else{
                return this.item.photo.small_file_url;
            }
        }
        return 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
      },
      getDate(time){
        return moment(time).fromNow()
      },
      listenAction(){
        this.$socket.on(`start_chat_action_${this.item._id}`,(data)=>{
           if(data.message){
             this.action_message = data.message
             this.is_action = true;
           }
        });
        this.$socket.on(`end_chat_action_${this.item._id}`,(data)=>{
          this.is_action = false;
        });
      }
    },
    beforeMount(){
      this.listenAction();
    },
    beforeDestroy(){
        this.$socket.off(`start_chat_action_${this.item._id}`);
        this.$socket.off(`end_chat_action_${this.item._id}`);
    }
  }
</script>

<style>

  .chat_action{
    font-size: 16px;
    color: #ea6666;
    font-style: italic;
  }

  .sideBar-body {
    position: relative;
    padding: 10px !important;
    border-bottom: 1px solid #f7f7f7;
    margin: 0 !important;
    cursor: pointer;
  }


  .sideBar-body:hover {
    background-color: #f2f2f2;
  }

  .sideBar-avatar {
    text-align: center;
    padding: 0 !important;
  }

  .avatar-icon img {
    border-radius: 50%;
    height: 49px;
    width: 49px;
  }

  .sideBar-main {
    padding: 0 !important;
  }

  .sideBar-main .row {
    padding: 0 !important;
    margin: 0 !important;
  }

  .sideBar-name {
    padding: 0 0 0 17px!important;
  }

  .sideBar-message{
    padding: 0 10px 10px 17px!important;
  }

  .name-meta {
    font-weight: normal;
    font-size: 19px;
    line-height: 21px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    text-align: left;
  }

  .message_meta{
    font-weight: normal;
    font-size: 16px;
    line-height: 21px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #454545;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    text-align: left;

  }

  .sideBar-time {

  }

  .time-meta {
    text-align: right;
    font-size: 12px;
    padding: 1% !important;
    color: rgba(0, 0, 0, .4);
    vertical-align: baseline;
  }

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
