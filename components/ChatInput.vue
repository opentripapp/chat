<template>
  <footer class="_2jVLL">
    <div class="_3oju3">
      <el-row :gutter="10">
        <el-col :span="1">
          <el-button type="text" icon="arrow-up"></el-button>
        </el-col>
        <el-col :span="22">
          <form action="">
            <el-input
              type="textarea"
              size="large"
              :autosize="{ minRows: 1, maxRows: 1}" placeholder="Type message"  v-model="msg" @keydown.native="inputHandler" @focus="startTyping" @blur="endTyping"></el-input>

          </form>
        </el-col>
        <el-col :span="1">
          <el-button ref="submit" type="text" icon="d-arrow-right"></el-button>
        </el-col>
      </el-row>
    </div>
  </footer>
</template>

<script>

  import {mapState} from 'vuex'

  export default{
      computed: mapState([
        'user'
      ]),
      props: ['data'],
      data(){
          return {
              msg:''
          }
      },
      methods:{
        startTyping(){
          if(this.data._id){
              this.$socket.emit('custom',{event:`start_chat_action_${this.data._id}`,message:`${this.user.name||'someone'} is typing...`});
          }
        },
        endTyping(){
          if(this.data._id){
            this.$socket.emit('custom',{event:`end_chat_action_${this.data._id}`,message:`${this.user.name||'someone'} is typing...`});
          }
        },
        inputHandler(e) {
          if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            this.submitForm();
          }
        },
        submitForm() {
          if (this.msg) {
              this.$socket.emit('send_message',{chat_id:this.data._id,text:this.msg},(result)=>{
                if(result.error){
                  this.$message.error(result.message || 'Oops, this is a error message.');
                }else{

                  this.msg = ''
                }
              });
          }
        }
      }
  }
</script>

<style>
  ._2jVLL {
    padding: 0;
    background-color: rgba(255, 255, 255, 0.6);
    -webkit-order: 3;
    order: 3;
    position: relative;
    -webkit-flex: none;
    flex: none;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
  }
  ._3oju3 {
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    background-color: #f5f1ee;
    padding: 10px 19px;
    -webkit-align-items: flex-end;
    align-items: flex-end;
    box-sizing: border-box;
    -webkit-flex-direction: row;
    flex-direction: row;
    max-width: 100%;
    position: relative;
    z-index: 2;
  }
</style>
