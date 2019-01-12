<template>
  <section style="height:100%">
    <section style="text-align:center">
      <el-input @input="inputWatcher" placeholder="输入导航名检索" style="width:12em" v-model="searchWords" clearable></el-input>
    </section>
    <el-menu @open="recordsFolderAdd" @close="recordsFolder" ref="topMenu" style="height:100%;width:200px" router :default-active="$route.path">
      <template v-for="(item,index) in searchMenu">
        <el-submenu :key="index" :index="`${index}`" v-if="item.title&&item.title!=''">
          <template slot="title">
            <span>{{item.title}}</span>
          </template>
          <el-menu-item-group v-for="(group,groupIdx) in item.groups" :key="groupIdx">
            <template slot="title" v-if="group.title&&group.title!=''">
              <span>{{group.title}}</span>
            </template>
            <el-menu-item v-show="!listItem.isHidden" :index="listItem.path" v-for="(listItem,listIdx) in group.list" :key="listIdx">
              {{listItem.title}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-if="!item.title || item.title==''" v-for="(group,index) in item" :key="index" :index="group.path"></el-menu-item>
      </template>
    </el-menu>
  </section>
</template>

<script>
import menuConfig from "../config/menuConfig";
export default {
  name: "sheep-menu",
  data() {
    return {
      menu: {},
      searchWords: "",
      curFolder: new Set()
    };
  },
  computed: {
    searchMenu() {
      return this.menu.map(m => {
        m.groups.map(group => {
          group.list = group.list.map(item => {
            item.title.includes(this.searchWords)? (item.isHidden = false):(item.isHidden = true);
            return item;
          });
          return group;
        });
        return m;
      });
    }
  },
  created() {
    this.menu = menuConfig;
    this.curFolder.add(0);
  },
  methods: {
    clearSearchWords() {
      this.searchWords = "";
    },
    inputWatcher(val) {
      if (val) {
        this.menuHandler("open");
      } else {
        this.menuHandler("close")
      }
    },
    recordsFolderAdd(index) {
      this.curFolder.add(index);
    },
    recordsFolder(index) {
      this.curFolder.delete(index);
    },
    menuHandler(method = "open", openArr = new Set()) {
      return new Promise((resolve, reject) => {
        const topMenu = this.$refs["topMenu"];
        let target = [];
        if (openArr.size == 0) {
          target = this.menu;
        } else {
          target = [...openArr].map(o => {
            return { index: o };
          });
        }
        if (topMenu) {
          try {
            this.$nextTick(() => {
              target.forEach(m => {
                topMenu[method](m.index);
              });
            });
            resolve();
          } catch (e) {
            reject();
          }
        }
      });
    },
  }
}
</script>
