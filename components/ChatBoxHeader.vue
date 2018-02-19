<template>
    <el-row  class="header">
      <div class="ava-bx">
        <div class="bf-ava">
          <img :src="getPhoto()" class="ava">
        </div>
      </div>
      <div class="name-blox">
        <div class="_2EbF-">
          <div class="_2zCDG">
            <span dir="auto" :title="title" class="_1wjpf">{{title}}</span>
          </div>
        </div>
        <div class="_3sgkv Gd51Q">
          <span :title="status" class="O90ur">{{status}}</span>
        </div>
      </div>
      <div class="_1i0-u">
          <div class="_3Kxus" style="cursor: pointer">
            <el-dropdown trigger="click" >
              <span class="el-dropdown-link" >
               <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span class="my-medium">Delete Conversation</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
      </div>
    </el-row>
</template>

<script>
  import moment from 'moment'
  export default{
      props: ['data'],
      watch: {
        data(newData, oldData) {
            if(oldData.from && oldData.from._id){
              this.removeEvent(`online:${oldData.from._id}`)
            }
            this.initData();
        }
      },
      data(){
          return {
              title:'Empty Room',
              picture:'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png',
              status:''
          }
      },
      methods:{
        getPhoto(){
          if(this.data.type === 'private'){
            return this.data.from.profile_picture || 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
          }
          if(this.data.type === 'group'){
            if(this.data.photo.small_file_url === 'none'){
              return 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
            }else{
              return this.data.photo.small_file_url;
            }
          }
          return 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
        },
        removeEvent(oldEvent){
            this.$socket.off(oldEvent);
        },
        initData(){
            this.title = 'Empty Room';
            this.picture = 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png';
            this.status = ''
            switch (this.data.type){
              case 'group':
                  this.title = this.data.title || 'Empty Room';
                  let _comma = ',';
                  this.data.members.forEach((item,index,datas)=>{
                      if(index === datas.length - 1){
                          _comma = ''
                      }
                      this.status = `${this.status} ${item.user.name}${_comma}`
                  });
                  break;
              case 'private':
                  this.title = this.data.from.name || 'Empty Room';
                  this.listenUserStatus(this.data.from._id);
                  break;
            }
            if(this.data.photo.small_file_url !== 'none'){
              this.picture = this.data.photo.small_file_url
            }else{
                this.picture = 'https://qiscuss3.s3.amazonaws.com/uploads/55c0c6ee486be6b686d52e5b9bbedbbf/2.png'
            }
        },
        listenUserStatus(id){
            this.$socket.on(`online:${id}`,(data)=>{
                if(data.online){
                   this.status = 'online'
                }else{
                  this.getUserStatus(id);
                }
            });
            this.getUserStatus(id);
        },
        getUserStatus(id){
            this.$socket.emit('get_user_status',id,(result)=>{
                if(!result.error){
                if(result.data.status && result.data.status.online){
                  this.status = 'online'
                }
                else if(result.data.status && result.data.status.last_active){
                  this.status = `Last visit ${moment(result.data.status.last_active).calendar()}`
                }
              }
          })
        }
      },
      beforeMount(){
        this.initData();
      },
      beforeDestroy(){
        switch (this.data.type){
          case 'group':
            break;
          case 'private':
            this.$socket.off(`online:${this.data.from._id}`);
            break;
        }
      }
  }
</script>

<style>
  .my-medium{
    font-size: medium;
  }
  ._3Kxus {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
  }

  ._1i0-u {
    -webkit-flex: none;
    flex: none;
  }

  ._2EbF- {
    text-align: left;
    margin-top: -1px;
    display: -webkit-flex;
    display: flex;
    line-height: normal;
    -webkit-align-items: flex-start;
    align-items: flex-start;
  }

  ._2zCDG {
    font-weight: normal;
    font-size: 16px;
    line-height: 21px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: black;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-grow: 1;
    flex-grow: 1;
  }
  ._1wjpf {
    -webkit-flex-grow: 1;
    flex-grow: 1;
    overflow: hidden;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Gd51Q._3sgkv {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
    line-height: 20px;
    min-height: 20px;
  }

  ._3sgkv {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-align-items: flex-start;
    align-items: flex-start;
  }

  .O90ur {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
  }

  .header {
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    height: 59px;
    width: 100%;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
    z-index: 1000;
    background-color: #eeeeee;
    padding: 10px 16px;
  }

  .name-blox {
    -webkit-flex-grow: 1;
    flex-grow: 1;
    min-width: 0;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .ava-bx{
    padding: 0 15px 0 0;
  }

  .bf-ava{
    height: 40px;
    width: 40px;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    background-color: #dfe5e7;
  }


  .ava{
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
