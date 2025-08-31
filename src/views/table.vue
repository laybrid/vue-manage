<template>
  <div>
    <table-search :query="query" :search="handleSearch" :options="searchOpt" :reset="handleReset"></table-search>
    <div class="container">
      <div style="margin-bottom: 15px;">
        <el-button type="warning">新增</el-button>
        <el-button plain type="info">列设置</el-button>
      </div>
      <el-table :data="tableData" border table-layout="auto" :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" align="center" label="序号" width="65" :index="indexMethod" />
        <el-table-column prop="name" label="用户名" align="center" />
        <el-table-column prop="money" label="账户余额" align="center" :formatter="formatterMoney" />
        <el-table-column prop="thumb" label="头像" align="center" />
        <el-table-column prop="state" label="账户状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.state ? 'success' : 'danger'">
              {{ row.state ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
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
      <el-pagination :current-page="page.pageNum" :page-size="page.pageSize" :background="true" :total="page.total"
        @current-change="handleSizeChange" layout="total,prev, pager, next, " style="margin-top: 20px;" />
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
  { type: 'select', label: '余额', prop: 'money', placeholder: ''}
])

const getSelectData = async () => {
  const res = await getTableList()
  const selectItem = searchOpt.value.find((item) => item.type === 'select')
  if(!selectItem){
    return
  }

  // 去重
  const uniqueMoneyValues = [...new Set(res.data.map((item: TableList) => item.money))]
  selectItem.opts = uniqueMoneyValues.map(money => ({ label: money, value: money }))
}
getSelectData()

const handleSearch = () => {
  getData({ name: query.name, money: query.money, _limit: page.pageSize })
  page.pageNum = 1
}
const handleReset = () => {
  query.name = ''
  query.money = ''
  page.pageNum = 1
  getData({ _page: page.pageNum, _limit: page.pageSize })
}


// 表格数据
const tableData = ref<TableList[]>([])
const page = reactive({
  pageSize: 4,
  pageNum: 1,
  total: 60
})

const getData = async (condition?: any) => {
  const res = await getTableList(condition)
  tableData.value = res.data
}
getData({ _page: page.pageNum, _limit: page.pageSize })

const handleSizeChange = (size: number) => {
  page.pageNum = size
  // 分页的时候还要考虑顶部的搜索栏
  if (query.name && query.money) {
    getData({ _page: page.pageNum, _limit: page.pageSize, name: query.name, money: query.money })
  }
  else {
    getData({ _page: page.pageNum, _limit: page.pageSize })
  }
}

const formatterMoney = (row: TableList) => {
  return '￥ ' + row.money
}

const indexMethod = (index: number) => {
  return (page.pageNum - 1) * page.pageSize + index + 1
}
</script>
