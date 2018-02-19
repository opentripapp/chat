<template>
  <div>
    <div v-if="showTime" class="msg-system">
      <div class="message-system"><span class="message-system-body"><span dir="auto" class="">{{startTime}}</span></span></div>
    </div>
    <el-row>
      <el-col :span="getFirstSpan">
        <div class="ava-bx2">
          <div class="bf-ava2" >
            <img :src="data.from.profile_picture || 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png' " class="ava2" v-if="showPicture">
          </div>
        </div>
      </el-col>
      <el-col :span="getSecondSpan">
        <div class="talk-bubble tri-right btm-right" v-bind:class="{'msg-out':fromMe}">
          <div v-if="showName" class="header-text">
            <p><b>{{data.from.name}}</b></p>
          </div>
          <div class="talktext">
            <p>{{data.text}}</p>
          </div>
          <div class="_2f-RV">
            <div class="_1DZAH" role="button">
              <span class="_3EFt_">{{time}}</span>
              <div class="status-icon" v-if="fromMe">
             <span data-icon="msg-check" class="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
                   <path fill="#92A58C" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>
             </span>
                <!--
                <span data-icon="msg-dblcheck-ack" class="">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
                    <path fill="#4FC3F7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                 </svg>
              </span>-->
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <!--<span class="msg msg-out">hahaha this is message</span>-->
</template>

<script>
  import {mapState} from 'vuex'
  import moment  from 'moment'
  export default {
    props: ['data','before','chat'],
    computed: {
      showTime(){
        if(!this.before){
            return true
        }
        let a = moment(this.before.createdAt);
        let b = moment(this.data.createdAt);
        let diff = b.diff(a,'hours');
        return diff > 23;

      },
      getFirstSpan(){
          if(this.isMe()){
              return 12
          }
          return 2
      },
      getSecondSpan(){
          if(this.isMe()){
            return 12
          }
          return 12
      },
      isAlert() {
        return this.data.type === 'alert'
      },
      showName(){
          if(this.isMe()){
            return false;
          }
          if(this.chat.type === 'private'){
              return false;
          }
          if(this.chat.type === 'group'){
              if(!this.before){
                  return true
              }
              return this.before.from._id !== this.data.from._id;
          }
          return true
      },
      fromMe(){
        return this.isMe();
      },
      showPicture(){
        if(this.isMe()){
           return false;
        }
        if(!this.before){
            return true
        }
        return this.before.from._id !== this.data.from._id;
      },
      ...mapState([
        'user'
      ])
    },
    methods:{
      isMe(){
          return this.data.from._id === this.user.id
      },
      getDate(){
          return moment().format('L');
      }

    },
    data(){
        return {
          time:moment(this.data.createdAt).format('LT'),
          startTime:moment(this.data.createdAt).format('L'),
          picture:this.data.from.profile_picture ||'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
        }
    },
    beforeMount(){

    }
  }
</script>

<style>
  .msg-system {
    padding:5px;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .message-system {
    -webkit-flex: none;
    flex: none;
    max-width: 100% !important;
    text-align: center;
    font-size: 12.5px;
    line-height: 14px;
    display: inline-block;
    border-radius: 7.5px;
    color: rgba(69,90,100,0.95);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
    background-color: rgba(225,245,254,0.92);
    padding: 5px 12px 6px 12px;
    box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
  }
  ._2f-RV {
    position: absolute;
    bottom: 3px;
    right: 7px;
  }
  ._1DZAH {
    color: rgba(0, 0, 0, 0.45);
    font-family: "Roboto", sans-serif;
    font-size: 11px;
    height: 15px;
    line-height: 15px;
    white-space: nowrap;
  }
  ._3EFt_ {
    margin-top: 1px;
    vertical-align: top;
    display: inline-block;
  }
  .status-icon {
    display: inline-block;
    margin-left: 3px;
  }

  .header-text{
    padding: 10px 10px 0 10px;
    text-align: left;
    line-height: 1.5em;
  }
  .talktext{
    padding: 5px 10px 10px 10px;
    text-align: left;
    line-height: 1.5em;
  }
  .talktext p,.header-text p{
    /* remove webkit p margins */
    margin: 0;
    padding: 0;
    border: 0;
    font-family: "Roboto",sans-serif;
    font-size: 14px;
    line-height: 19px;
    color: #262626;
    vertical-align: baseline;
    outline: none;
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
  }
  .talk-bubble {
    margin: 5px 5px 0 1px;
    display: inline-block;
    position: relative;
    width: 100%;
    height: auto;
    background-color: lightyellow;
    border-radius: 10px;
  }


  .talk-bubble.msg-out{
    background: #dcf8c6;
  }
  .msg{
    margin: .125em 0;
    padding: .5em 1.25em;
    background: white;
    border-radius: 1em;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .25);
    align-self: flex-start;
  }

  .ava-bx2{

    padding: 0 15px 0 0;
  }

  .bf-ava2{
    height: 40px;
    width: 40px;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
  }


  .ava2{
    display: block;
    opacity: 1;
    position: relative;
    transition: opacity 150ms ease-out;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    z-index: 100;
    overflow: hidden;
  }
</style>
