<template>
    <div style="position:relative;">
        <el-tree :default-checked-keys="checkedData" ref="tree" node-key="id" show-checkbox :data="treeData" :props="defaultProps"></el-tree>
        <el-checkbox v-show="showCheckbox" v-model="checkAll" style="position:absolute;right:10%;top:0;">全选</el-checkbox>
    </div>
</template>

<script>
import { permissionData,permissionKey} from "@/commonalityNet/permission.js";
export default {
    name:'permission-tree',
    props:['checkedData','showCheckbox','isModify'],
    data(){
        return{
            defaultProps:{
                children: 'children',
                label: 'name',
                disabled: function(data,node){
                }
            },
            checkAll: false,
            treeData: permissionData
        }
    },
    created(){
        if(this.checkedData.length == permissionKey.length) {
            this.checkAll = true
        }
    },
    watch: {
        checkAll(cur){
            if(cur == true){
                this.$refs.tree.setCheckedKeys(permissionKey);
            } else{
                /* if(this.isModify){
                    this.$refs.tree.setCheckedKeys(this.checkedData);
                }else{ */
                    this.$refs.tree.setCheckedKeys([]);
                /* } */
            }
        },
        /* 本来是想通过这个方法设置，用户本身角色所包含的权限不能删减，只能在此基础上增加，但是失败了，看到这里的朋友可以尝试一下 */
        /* checkedData(cur){
            this.$refs.tree.setCheckedKeys(cur)
            if(this.checkedData.length == permissionKey.length) {
                this.checkAll = true
            }
            if(this.checkedData.length> 0){
                this.defaultProps.disabled=(data,node) => {
                    let result = false 
                    if(!this.showCheckbox){
                        result = true
                    }else{
                        if(node.isLeaf){
                            if(this.checkedData.includes(data.id)){
                                if(this.isModify){
                                    result = true
                                }
                            }
                        }
                    }
                    return result
                }
            }
        } */
    },
    methods:{
        returnCheckedKeys(){
            return this.$refs.tree.getCheckedKeys(true);
        }
    }
}
</script>

<style scoped>
.tree-node-block{
    display: block;
}
.tree-node-inline{
    display: inline-block;
}
</style>