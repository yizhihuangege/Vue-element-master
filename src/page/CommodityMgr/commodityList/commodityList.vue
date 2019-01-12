<template>
    <section v-loading="isLoad">
      <el-header>
        <auto-bread-crumb></auto-bread-crumb>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="4" class="mr_r15">
               <el-input v-model="searchBox.commodityName" placeholder="商品名称" clearable ></el-input>
          </el-col>
          <el-col :span="3" class="mr_r15">
              <el-input v-model="searchBox.gameName" placeholder="游戏名称" clearable ></el-input>
          </el-col>
          <el-col :span="3" class="mr_r15">
              <el-select v-model="searchBox.state" placeholder="状态" clearable @change="search">
                <el-option v-for="(item,index) of status" :key="index" :value="item.value"  :label="item.label"></el-option>
              </el-select>
          </el-col>
          <el-col :span="3" class="mr_r15">
            <el-select v-model="searchBox.salesVolume" placeholder="销量" clearable @change="search">
              <el-option v-for="(item,index) of sellNumSort" :key="index" :value="item.value"  :label="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="searchBox.types" placeholder="类型" class="mr_r15" clearable @change="search">
              <el-option v-for="(item,index) of type" :key="index" :value="item.value"  :label="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-col>

        </el-row>
        <el-row>
          <el-col class="x-area" :span="2" style="padding: 10px 0">
            <el-button type="primary" @click="addCommodity" icon="el-icon-plus">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
          <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
            <template slot-scope="scope">
              <img v-if="item.prop==='pics'" :src="scope.row.pics" @click="viewPicture(scope.row.pics)" style="width:100%;max-width:200px" :alt="scope.row.pics">
              <span v-else-if="item.prop==='type'" >{{scope.row.type | reType}}</span>
              <span v-else-if="item.prop==='mall_game'" >{{scope.row.mall_game.game_name}}</span>
              <span v-else-if="item.prop==='status'" >{{scope.row.status===1?'已上架':'已下架'}}</span>
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="addStock(scope.row)" type="text" size="small">补仓</el-button>
              <el-button  @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button  @click="remove(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-row class="area" type="flex" justify="center">
          <el-pagination @current-change="search"
                         background
                         layout="total,prev, pager, next, jumper"
                         :current-page.sync="tableBody.curPage"
                         :total="tableBody.countTotal"
                         :page-size="tableBody.pageSize">
          </el-pagination>
        </el-row>
      </el-main>

      <!-- 添加、编辑商品 -->
      <el-dialog :title="dialog.title" v-if="dialog.addCommodityVisible" :visible.sync="dialog.addCommodityVisible" width="60%" :before-close="handleClose">
        <addCommodityList :data="dialog.addCommodityData" :isModify="dialog.addCommodityModify" v-if="dialog.addCommodityVisible" :visible.sync="dialog.addCommodityVisible" @complate="postData"></addCommodityList>
      </el-dialog>

      <el-dialog title="补仓" v-if="stockDialogShow" width="20%" :visible.sync="stockDialogShow">
          <span>数量: </span>
          <el-input v-model="addStockNum" type="Number"  style="width:80%" placeholder="请输入数量" clearable ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-row class="area" type="flex" justify="center">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ok">提 交</el-button>
            </el-row>
          </span>
      </el-dialog>
      <!-- 单个图片查看器 -->
      <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
    </section>
</template>

<script>

import { tableConfig} from '../../../config/defaultData';
import addCommodityList from "./child/addCommodityList";
export default {
  name: "commodityList",
  components: {
    addCommodityList
  },
  data() {
    return {
      isLoad: false,
      searchBox: {
        commodityName: "",
        gameName: "",
        state: "",
        salesVolume: "",
        types: ""
      },
      status: status,
      type: type,
      sellNumSort: sellNumSort,
      tableBody: tableConfig(tableHeader,10),
      dialog: {
        title: "",
        addCommodity: false,
        addCommodityModify: false,
        addCommodityVisible: false,
        addType: 0,
        addCommodityData: {}
      },
      stockDialogShow: false,
      addStockNum: "",
      rowId: "",
      photoWatcher:{
        img:"",
        visible:false
      },
    };
  },
  filters:{
    reType(val) {
      return ["充值","上号","登记","游戏","通用"][val-1]
    },
  },
  methods: {
    // 添加商品按钮
    addCommodity() {
      this.dialog.addCommodityData = {};
      this.dialog.title = "添加商品";
      this.dialog.addCommodityModify = false;
      this.dialog.addCommodityVisible = true;
    },
    // 商品编辑按钮
    edit(row) {
      this.dialog.title = "编辑商品";
      this.dialog.addCommodityData = row;
      this.dialog.addCommodityModify = true;
      this.dialog.addCommodityVisible = true;
    },
    // 接口数据处理获取
    search() {
      this.tableBody.isLoad = true;
      let params = {
        status: this.searchBox.state,
        type: this.searchBox.types,
        name: this.searchBox.commodityName,
        game_name: this.searchBox.gameName,
        sell_num_sort: this.searchBox.salesVolume,
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/goods/index`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            this.tableBody.data = resp.data.data.data;
            this.tableBody.countTotal = resp.data.data.total;
          }
        })
        .catch(resp => {});
    },
    // 数据提交
    postData(param) {
      const params = {};
      let flag = true;
      if (this.dialog.addCommodityModify) {
        params.id = param.id;
        params.name = param.name;
        params.type = param.type;
        params.status = param.status;
        params.pics = param.pics;
        params.price = param.price;
        params.content = param.content;
        params.mall_game_id = param.mall_game_id;
        if (param.tsy_goods_id) {
          params.tsy_goods_id = param.tsy_goods_id;
          params.discount = param.discount;
          params.expire_hour = param.expire_hour;
        }

        params.stock = param.stock;
        params.exchange_limit = param.exchange_limit;
      } else {
        params.name = param.name;
        params.type = param.type;
        params.status = param.status;
        params.pics = param.pics;
        params.price = param.price;
        params.content = param.content;
        params.mall_game_id = param.mall_game_id;

        params.stock = param.stock;
        params.exchange_limit = param.exchange_limit;

        if (param.tsy_goods_id) {
          params.tsy_goods_id = param.tsy_goods_id;
          params.discount = param.discount;
          params.expire_hour = param.expire_hour;
        }
      }
      for (let k in params) {
        if (params[k] === undefined || params[k] === "") {
          if (k === "mall_game_id") {
            params[k] = 6;
          } else {
            this.$message.error("有选项未填写");
            flag = false;
            break;
          }
        }
      }
      if (flag) {
        this.$message("正在提交");
        if (this.dialog.addCommodityModify) {
          this.editPost(params);
        } else {
          this.addOne(params);
        }
      } else {
        return;
      }
    },
    // 编辑接口提交
    editPost(params) {
      this.$http
        .post(`${process.env.GUESSING_HOST_URL}/api/admin/goods/update`, params)
        .then(resp => {
          if (resp.data.success) {
            this.$message.success("编辑成功");
            this.search();
          } else {
            this.$message.error(resp.data.errors);
          }
        })
        .catch(resp => {});
    },
    // 添加商品接口提交
    addOne(params) {
      this.$http
        .post(`${process.env.GUESSING_HOST_URL}/api/admin/goods/store`, params)
        .then(resp => {
          if (resp.data.success) {
            this.$message.success("提交成功");
            this.search();
          } else {
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_ => {});
    },
    // 删除商品接口提交
    remove(row) {
      this.$confirm("是否删除该商品?")
        .then(_ => {
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/goods/delete`, {id: row.id})
            .then(resp => {
              if (resp.data.success) {
                this.$message.success("删除成功");
                this.search();
              } else {
                this.$message.error(resp.data.errors);
              }
            })
            .catch(_ => {});
        })
        .catch(_ => {});
    },
    
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //补仓
    addStock(row) {
      this.rowId = row.id;
      this.stockDialogShow = true;
      this.addStockNum = "";
    },
    cancel() {
      this.stockDialogShow = false;
    },
    ok() {
      let params = {
        id: this.rowId,
        stock: this.addStockNum
      };
      this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/add_stock`, params)
        .then(resp => {
          if (resp.data.success) {
            this.$message.success("补仓成功");
            this.stockDialogShow = false;
            this.search();
          } else {
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_ => {});
    },
     viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    },
  },
  created() {
    this.search();
  }
};

const status = [{ value: 1, label: "已上架" }, { value: 2, label: "已下架" }];

const type = [
  { value: 4, label: "游戏" },
  { value: 5, label: "通用" }
];

const sellNumSort = [{ value: 1, label: "正序" }, { value: 2, label: "倒序" }];

const tableHeader = [
  { prop: "id", label: "商品ID" },
  { prop: "name", label: "商品名称" },
  { prop: "mall_game", label: "游戏名称" },
  { prop: "pics", label: "缩略图" },
  { prop: "type", label: "类型" },
  { prop: "price", label: "价格" },
  { prop: "status", label: "状态" },
  { prop: "sell_num", label: "销量" },
  { prop: "shelf_time", label: "上架时间" },
  { prop: "stock", label: "库存" },
  { prop: "exchange_limit", label: "兑换上限（天/人）" }
];

</script>

<style scoped>
.mr_r15 {
  margin-right: 15px;
}
</style>
