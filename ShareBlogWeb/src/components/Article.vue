<template>
  <div>
    <div class="demo-input-suffix" style="display: flex">
    <el-button type="primary" @click="addArticle">新增</el-button>
    <el-button type="danger" @click="batchDelete">批量删除</el-button>
      <span id="findMsg">查询条件：</span>
      <el-date-picker
        v-model="startTime"
        type="date"
        placeholder="开始日期">
      </el-date-picker>
      <el-date-picker
        v-model="endTime"
        type="date"
        placeholder="结束日期">
      </el-date-picker>
      <el-input
        placeholder="标题关键字"
        prefix-icon="el-icon-search"
        v-model="titleKey">
      </el-input>
      <el-button type="primary" @click="searchArticle">搜索</el-button>
      <el-button type="primary" @click="searchReset">重置</el-button>
    </div>
    <el-table
      :data="Articles"
      border
      style="width: 100%"
      @selection-change="selectBatchDelete">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="article.title"
        label="文章标题"
        width="240">
      </el-table-column>
      <el-table-column
        prop="category.name"
        label="所属栏目"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="author.username"
        label="作者"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="article.publishtime"
        label="发布时间"
        width="200px">
      </el-table-column>
      <el-table-column
        prop="article.readtimes"
        label="阅读次数">
      </el-table-column>
      <el-table-column
        prop="article.source"
        label="文章封面">
        <template v-slot="scope">
          <img style="height:30px" :src="scope.row.article.source" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="article.status"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="scope">
          <i class="el-icon-edit-outline" @click="editArticle(scope.row.article.id)"></i>
          <i class="el-icon-delete" @click="deleteArticle(scope.row.article.id)"></i>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="prePage"
        @next-click="nextPage"
        :current-page="pageObj.currentPage"
        :page-sizes="pageObj.pageSizes"
        :page-size="pageObj.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 新增文章模态框 -->
    <el-dialog title="发布文章" :visible.sync="article_visible">
      <el-form :model="article_form">
        <el-form-item label="文章标题" :label-width="formLabelWidth">
          <el-input v-model="article_form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章封面" :label-width="formLabelWidth">
          <!-- 图片上传 -->
          <el-upload
            action="http://localhost:8081/manager/file/upload "
            list-type="picture-card"
            :on-success='saveSuccessHandler'
            :on-remove="removeHandler">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="所属栏目" :label-width="formLabelWidth">
          <el-select v-model="article_form.categoryId" placeholder="请选择栏目">
            <el-option v-for="item in Categories" :label="item.category.name" :value="item.category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="正文" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="article_form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleSave">取 消</el-button>
        <el-button type="primary" @click="saveArticle">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改文章模态框 -->
    <el-dialog title="修改文章" :visible.sync="update_article_visible">
      <el-form :model="update_article_form">
        <el-form-item label="文章标题" :label-width="formLabelWidth">
          <el-input v-model="update_article_form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章封面" :label-width="formLabelWidth">
          <!-- 图片上传 -->
          <el-upload
            action="http://localhost:8081/manager/file/upload "
            list-type="picture-card"
            :on-success='successHandler'
            :on-remove="removeHandler">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="所属栏目" :label-width="formLabelWidth">
          <el-select v-model="update_article_form.categoryId" placeholder="请选择栏目">
            <el-option v-for="item in Categories" :label="item.category.name" :value="item.category.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="正文" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="update_article_form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="update_article_visible=false">取 消</el-button>
        <el-button type="primary" @click="updateArticle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {get,post_json,delete_array,put} from '@/http/axios'
  import moment from 'moment';
  export default {
    name:'Article',
    data() {
      return {
        Articles: [],
        Categories:[],
        multipleSelection: [],
        fileUrl:"http://120.24.21.21:8888/",
        dialogImageUrl: '',
        dialogVisible: false,
        article_form:{
          userId:1,
          categoryId:'',
          content:'',
          title:''
        },
        update_article_form:{

        },
        article_visible:false,
        update_article_visible:false,
        formLabelWidth:'',
        startTime:'',
        endTime:'',
        titleKey:'',
        //分页对象
        pageObj:{
          pageSizes:[3,5,7,10,15,20],
          pageSize:5,
          currentPage:1
        },
        total:0,
        batchDeleteData:[]
      }
    },
    watch:{
      //监听分页对象
      pageObj:{
        handler(){
          this.findPage();
        },
        deep:true
      }
    },
    created(){
      this.findPage();
    },
    methods: {
      //分页函数
      handleSizeChange(pageSize){
        this.pageObj.pageSize = pageSize;
        this.pageObj.currentPage=1;
      },
      handleCurrentChange(currentPage){
        this.pageObj.currentPage = currentPage;
      },
      prePage(){
        this.pageObj.currentPage = this.pageObj.currentPage-1;
      },
      nextPage(){
        this.pageObj.currentPage = this.pageObj.currentPage+1;
      },
      //分页查询
      async findPage(){
        if (this.startTime!=''){
         this.startTime = moment(this.startTime).format('YYYY-MM-DD');
        }
        if(this.endTime!=''){
          this.endTime = moment(this.endTime).format('YYYY-MM-DD');
        }
        let res = await get('/manager/article/findArticleByCondition',{page:this.pageObj.currentPage,pageSize:this.pageObj.pageSize,startTime:this.startTime,endTime:this.endTime,title:this.titleKey});
        this.Articles = res.data.data.records.map((item)=>{
          item.article.source=this.fileUrl+item.article.source;
          return item;
        });
        this.total = res.data.data.total;
      },

      //选中需要删除的文章
      selectBatchDelete(selection){
        this.batchDeleteData = [];
        selection.forEach((item)=>{
          this.batchDeleteData.push(item.article.id);
        });
        console.log(this.batchDeleteData);
      },
      //批量删除
      async batchDelete(){
        const h = this.$createElement;
        if(this.batchDeleteData.length>0){
          let res = await delete_array('/manager/article/batchDelete',{ids:this.batchDeleteData.toString()});
          //刷新数据 如果当前页不是第一页，通过改变分页对象属性刷新，否则请求方法
          if(this.pageObj.currentPage!=1){
            this.pageObj.currentPage=1;
          }else {
            this.findPage();
          }
          this.$notify({
            title: '通知',
            message: h('i', { style: 'color: teal'}, res.data.msg)
          });
        }else {
          this.$notify({
            title: '警告',
            message: h('i', { style: 'color: teal'}, '请选择要删除的元素！')
          });
        }
      },
      //更新文章
      async updateArticle(){
        let res = await put('/manager/article/updateArticle',this.update_article_form);
        const h = this.$createElement;
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: teal'}, res.data.msg)
        });
        this.update_article_visible = false;
        //刷新数据 如果当前页不是第一页，通过改变分页对象属性刷新，否则请求方法
        if(this.pageObj.currentPage!=1){
          this.pageObj.currentPage=1;
        }else {
          this.findPage();
        }
      },
      //编辑文章 点击编辑按钮
      async editArticle(id){
        let res = await get('/manager/article/findArticleById',{id:id});
        this.findAllCategory();
        this.update_article_form = res.data.data.article;
        this.update_article_visible = true;
      },
      //重置
      searchReset(){
        this.startTime='';
        this.endTime='';
        this.titleKey='';
        //刷新数据 如果当前页不是第一页，通过改变分页对象属性刷新，否则请求方法
        if(this.pageObj.currentPage!=1){
          this.pageObj.currentPage=1;
        }else {
          this.findPage();
        }
      },
      //搜索
      async searchArticle(){
        //刷新数据 如果当前页不是第一页，通过改变分页对象属性刷新，否则请求方法
        if(this.pageObj.currentPage!=1){
          this.pageObj.currentPage=1;
        }else {
          this.findPage();
        }
      },
      //删除文章
      async deleteArticle(id){
        let res =await delete_array('/manager/article/deleteById',{id:id});
        //刷新数据 如果当前页不是第一页，通过改变分页对象属性刷新，否则请求方法
        if(this.pageObj.currentPage!=1){
          this.pageObj.currentPage=1;
        }else {
          this.findPage();
        }
        const h = this.$createElement;
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: teal'}, res.data.msg)
        });
      },
      cancleSave(){
        this.article_visible=false;
        this.article_form.categoryId='';
        this.article_form.content='';
        this.article_form.title='';
      },
      async saveArticle(){
        this.article_visible=false;
        let res =await post_json('/manager/article/saveArticle',this.article_form);
        //刷新数据 如果当前页不是第一页，通过改变分页对象属性刷新，否则请求方法
        if(this.pageObj.currentPage!=1){
          this.pageObj.currentPage=1;
        }else {
          this.findPage();
        }
        this.article_form.categoryId='';
        this.article_form.content='';
        this.article_form.title='';
        const h = this.$createElement;
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: teal'}, res.data.msg)
        });
      },
      //查询所有栏目
      async findAllCategory(){
        let res =await get('/manager/category/findAllCategory',{});
        this.Categories = res.data.data;
      },
      //查询所有文章
      async findAllArticles(){
        let res = await get('/manager/article/findAllArticle',{});
        this.Articles = res.data.data.map((item)=>{
          item.article.source=this.fileUrl+item.article.source;
          return item;
        });
      },
      //点击新增按钮弹出模态框
      addArticle(){
        this.article_visible=true;
        this.article_form.categoryId='';
        this.article_form.content='';
        this.article_form.title='';
        this.findAllCategory();
      },
      async removeHandler(file) {
        let res = await get('/manager/file/delete',{id:file.response.data.id});
        const h = this.$createElement;
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: teal'}, res.msg)
        });
      },
      //更新时上传
      successHandler(file){
        this.update_article_form.source = file.data.id;
        const h = this.$createElement;
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: teal'}, "上传成功！")
        });
      },
      //新增
      saveSuccessHandler(file){
        this.article_form.source = file.data.id;
        this.dialogImageUrl = true;
        const h = this.$createElement;
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: teal'}, "上传成功！")
        });
      }
    }
  }
</script>

<style scoped>
  .el-date-picker,.el-input{
    width: 150px;
    margin: 10px;
  }
  .el-button{
    margin: 10px;
  }
  #findMsg{
    height: 40px;
    margin-bottom: 10px;
    margin-top: 10px;
    line-height: 40px;
  }
</style>

