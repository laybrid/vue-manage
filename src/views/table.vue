<template>
  <div>
    <table-search
      :query="query"
      :search="handleSearch"
      :options="searchOpt"
      :reset="handleReset"
    ></table-search>
    <div class="container">
      <div style="margin-bottom: 15px">
        <el-button type="warning" @click="addTableItem">新增</el-button>
        <el-button plain type="info" v-show="false">列设置</el-button>
        <el-button plain type="text" style="float: right" @click="handleRefresh"
          >刷新</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        table-layout="auto"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="65"
          :index="indexMethod"
        />
        <el-table-column prop="name" label="用户名" align="center" />
        <el-table-column
          prop="money"
          label="账户余额"
          align="center"
          :formatter="formatterMoney"
        />
        <el-table-column prop="thumb" label="头像" align="center" />
        <el-table-column prop="state" label="账户状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.state ? 'success' : 'danger'">
              {{ row.state ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作"
          align="center"
          width="250"
        >
          <template #default="{ row }">
            <el-button type="warning" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        :background="true"
        :total="page.total"
        @current-change="handleSizeChange"
        layout="total,prev, pager, next, "
        style="margin-top: 20px"
      />
    </div>

    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      v-model="visible"
      width="700px"
      destroy-on-close
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <table-edit
        :form-data="rowData"
        :options="editOpt"
        :edit="isEdit"
        :label-width="100"
        :span="24"
        :update="updateData"
      ></table-edit>
    </el-dialog>

    <el-dialog
      title="查看详情"
      v-model="visible1"
      width="700px"
      destroy-on-close
    >
      <table-detail :list="viewData.list" :row="viewData.row"></table-detail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'
import tableSearch from '@/components/table-search.vue'
import tableEdit from '@/components/table-edit.vue'
import tableDetail from '@/components/table-detail.vue'
import type { FormOptions, TableList } from '@/types'
import { getTableList, deleteTableList } from '@/api'

// 查询相关
const query = reactive({
  name: '',
  money: '',
  state: false,
  thumb: ''
})
const searchOpt = ref<FormOptions[]>([
  { type: 'input', label: '用户名：', prop: 'name' },
  { type: 'select', label: '余额', prop: 'money', placeholder: '' }
])

const getSelectData = async () => {
  const res = await getTableList()
  const selectItem = searchOpt.value.find(item => item.type === 'select')
  if (!selectItem) {
    return
  }

  // 去重
  const uniqueMoneyValues = [
    ...new Set(res.data.map((item: TableList) => item.money))
  ]
  uniqueMoneyValues.sort((a: any, b: any) => a - b)
  selectItem.opts = uniqueMoneyValues.map(money => ({
    label: money,
    value: money
  }))
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
    getData({
      _page: page.pageNum,
      _limit: page.pageSize,
      name: query.name,
      money: query.money
    })
  } else {
    getData({ _page: page.pageNum, _limit: page.pageSize })
  }
}

const formatterMoney = (row: TableList) => {
  return '￥ ' + row.money
}

const indexMethod = (index: number) => {
  return (page.pageNum - 1) * page.pageSize + index + 1
}
const handleRefresh = () => {
  getData({ _page: page.pageNum, _limit: page.pageSize })
  getSelectData()
}
// edit and add and remove
const visible = ref(false)
const isEdit = ref(false)
const rowData = ref<TableList>({
  name: '',
  money: 0,
  thumb: '',
  state: true
})
const editOpt = ref<FormOptions[]>([
  { type: 'input', label: '用户名', prop: 'name', required: true },
  { type: 'number', label: '账户余额', prop: 'money', required: true },
  {
    type: 'switch',
    activeText: '正常',
    inactiveText: '异常',
    label: '账户状态',
    prop: 'state',
    required: true
  },
  { type: 'upload', label: '头像', prop: 'thumb', required: true }
])

const addTableItem = () => {
  visible.value = true
  rowData.value = {
    name: '',
    money: 0,
    thumb: '',
    state: true
  }
}
const handleEdit = (row: TableList) => {
  isEdit.value = true
  rowData.value = { ...row }
  visible.value = true
}

const handleDelete = (row: TableList) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      await deleteTableList(row.id)
      getData({ _page: page.pageNum, _limit: page.pageSize })
      getSelectData()
    })
    .catch(() => {
      console.log('取消删除')
    })
}
const updateData = () => {
  closeDialog()
  getData({ _page: page.pageNum, _limit: page.pageSize })
  getSelectData()
}

const closeDialog = () => {
  visible.value = false
  isEdit.value = false
}

// 查看
const visible1 = ref(false)
const viewData = reactive({
  list: [] as Pick<FormOptions, 'prop' | 'label'>[],
  row: {
    id: '',
    name: '',
    money: 0,
    thumb: '',
    state: true
  } as TableList
})
const handleView = (row: TableList) => {
  viewData.row = { ...row }
  viewData.list = [
    {
      prop: 'id',
      label: '用户ID'
    },
    {
      prop: 'name',
      label: '用户名'
    },
    {
      prop: 'money',
      label: '账户余额'
    },
    {
      prop: 'state',
      label: '账户状态'
    },
    {
      prop: 'thumb',
      label: '头像'
    }
  ]
  visible1.value = true
}
</script>
