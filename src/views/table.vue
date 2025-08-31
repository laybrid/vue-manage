<template>
  <div>
    <table-search :query="query" :search="handleSearch" :options="searchOpt"></table-search>
    <div class="container">
      <div style="margin-bottom: 15px;">
        <el-button type="warning">新增</el-button>
        <el-button plain type="info">列设置</el-button>
      </div>
      <el-table :data="tableData" border table-layout="auto" :header-cell-style="{ background: '#f5f7fa' }"  >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" align="center" label="序号" width="65" />
        <el-table-column prop="name" label="用户名" align="center" />
        <el-table-column prop="money" label="账户余额" align="center" :formatter="formatterMoney"/>
        <el-table-column prop="thumb" label="头像" align="center" />
        <el-table-column prop="state" label="账户状态" align="center" />
        <el-table-column prop="operator" label="操作" align="center" width="250">
          <template #default>
            <el-button type="warning" size="small">
              查看
            </el-button>
            <el-button type="primary" size="small">
              编辑
            </el-button>
            <el-button type="danger" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import tableSearch from '@/components/table-search.vue';
import type { FormOptions, TableList } from '@/types';
import { getTableList } from '@/api';

// 查询相关
const query = reactive({
  name: '',
  money: '',
  state: false
});
const searchOpt = ref<FormOptions[]>([
  { type: 'input', label: '用户名：', prop: 'name' },
  { type: 'select', label: '余额', prop: 'money', placeholder: '', opts: [{ label: '100', value: '100' }, { label: '200', value: '200' }, { label: '300', value: '300' }] }
])
const handleSearch = ()=>{
  console.log('search success')
}

// 表格数据
const tableData = ref<TableList[]>([])
const getData = async () => {
  const res = await getTableList()
  tableData.value = res.data
}
getData()

const formatterMoney = (row: TableList) => {
  return '￥ ' + row.money
}
</script>

