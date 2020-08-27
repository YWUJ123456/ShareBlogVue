<template>
  <el-container style="height:580px;width:100%;margin-top: 0px;display: flex;">
    <!--左侧导航栏-->
    <el-aside style="width: 250px;height: 580px;">
      <h5 style="color: #ffffff;height: 30px;line-height: 30px;">ShareBlog</h5>
      <el-row class="tac">
        <el-col>
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#304156"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="indexSelect"
            >
            <el-menu-item index="1">
              <i class="el-icon-house"></i>
              <span slot="title">首&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp页</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-money"></i>
              <span slot="title">栏目管理</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title">文章管理</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-chat-line-round"></i>
              <span slot="title">评论管理</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <!--右侧-->
    <el-container style="display: flex;flex-flow: column;width: 100%;background-color: #f0f2f5">
      <!--头部-->
      <el-header height="100px" style="width: 98%;margin: 1%;text-align: center">
        <span style="font-size: 30px;line-height: 100px;height: 100%">ShareBlog后台管理系统</span>
      </el-header>
      <!--主体部分-->
      <el-main style="height: 100%;width:98%;margin-left: 1%;margin-right: 1%;margin-bottom: 1%">
        <div style="overflow: auto;height: 100%;width: 100%">
<!--          <Article v-if="index==3"></Article>-->
          <keep-alive>
            <component :is="curComponent"></component>
          </keep-alive>
<!--          <router-view></router-view>-->
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Article from "./Article";
  export default {
    components: {Article},
    data(){
      return{
        index:0,
        curComponent:''
      }
    },
    methods:{
      indexSelect(index){
        if(index==3){
          this.curComponent='Article';
        }else {
          this.curComponent = '';
        }
      },
      push(url){
        this.$router.push(url);
      }
    }
  }

</script>

<style>
  #app{
    margin-top: 0px;
  }
  .el-header {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #304156;
    color: #333;
    text-align: center;
    line-height: 300px;
  }

  .el-main {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    padding: 0px;
  }

</style>
