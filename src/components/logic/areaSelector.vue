<template>
    <section :style="{display:sectionStyle}">
          <el-cascader 
            :style="{'width':width}"
            :options="options"
            :props = "props"
            v-model="selectedOptions"
            @change="emitData"
            change-on-select
            placeholder="请选择区域"
            :disabled="selectorType"
            >
        </el-cascader>
    </section>
</template>

<script>
import { areaAPI, areaData } from "@/commonalityNet/area.js";

export default {
  name: "area-selector",
  props: {
    maxLevel: {
      type: Number,
      default: 3
    },
    value: [Array, Number, String],
    width: {
      type: String,
      default: "80%"
    },
    sectionStyle: {
      type: String,
      default: "block"
    },
    needNotice: {
      type: Boolean,
      default: false
    },
    selectorType:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      options: [],
      selectedOptions: [],
      lastSelectedOptions: [],
      props: {
        value: "id",
        label: "name",
        children: "active_children"
      }
    };
  },
  created() {
    this.format();
    this.init();
  },
  watch: {
    value(cur) {
      let v = null;
      if (Array.isArray(cur)) {
        v = cur;
      } else {
        v = [];
      }

      this.selectedOptions = v || [];
    }
  },
  methods: {
    format(target = areaData.all_map) {
      return target.map(area => {
        if (area.children) {
          const isNotEmpty = area.children.length != 0;
          const isRightLevel = area.level < this.maxLevel;
          if (isNotEmpty && isRightLevel) {
            this.format(area.children);
            area.active_children = area.children;
          } else {
            delete area.active_children;
          }
        } else {
          delete area.active_children;
        }
        return area;
      });
    },
    init() {
      let value = null;
      if (Array.isArray(this.value)) {
        value = this.value;
      } else {
        value = [];
      }

      this.selectedOptions = value || [];
      this.lastSelectedOptions = value || [];
      const originMap = JSON.parse(JSON.stringify(areaData.all_map));
      this.options = this.format(originMap);
      
    },
    emitData(options) {
      if (this.needNotice && this.lastSelectedOptions.length != 0) {
        let isDiff = false;
        if (this.lastSelectedOptions.length != options.length) {
          isDiff = true;
        }
        this.lastSelectedOptions.forEach((option, index) => {
          if (options[index] != option) {
            isDiff = true;
          }
        });

        if (isDiff) {
          this.$confirm("此操作将修改曾经，确认修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$emit("input", options);
              this.lastSelectedOptions = options;
            })
            .catch(() => {});
        }
      } else {
        this.$emit("input", options);
        this.lastSelectedOptions = options;
      }
    }
  }
};
</script>

<style scoped>
</style>

