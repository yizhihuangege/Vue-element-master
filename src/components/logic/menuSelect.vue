<template>
    <el-select v-model="value8" filterable placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
    import menuConfig from '../../config/menuConfig.js';

    export default {
        name: 'menu-select',
        data() {
            return {
                menuConfig
            }
        },
        computed:{
            
        }
    }
</script>

<style scoped>
</style>