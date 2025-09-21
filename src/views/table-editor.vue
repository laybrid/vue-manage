<template>
  <div class="performance-test-container">
    <!-- 性能监控面板 -->
    <div class="performance-panel">
      <el-card class="stats-card">
        <template #header>
          <div class="card-header">
            <span>性能监控</span>
            <el-button
              type="primary"
              size="small"
              @click="startPerformanceTest"
              :loading="isTesting"
            >
              开始测试
            </el-button>
          </div>
        </template>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">FPS</div>
            <div :class="['stat-value', getFPSClass(currentFPS)]">
              {{ currentFPS.toFixed(1) }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">内存使用</div>
            <div class="stat-value">{{ memoryUsage }} MB</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">渲染时间</div>
            <div class="stat-value">{{ renderTime }} ms</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">数据量</div>
            <div class="stat-value">{{ data.length.toLocaleString() }}</div>
          </div>
        </div>
      </el-card>

      <!-- 测试控制面板 -->
      <el-card class="control-card">
        <template #header>
          <span>测试控制</span>
        </template>

        <div class="control-grid">
          <div class="control-group">
            <label>数据量：</label>
            <el-select v-model="dataSize" @change="updateDataSize">
              <el-option label="1K 行" :value="1000" />
              <el-option label="5K 行" :value="5000" />
              <el-option label="10K 行" :value="10000" />
              <el-option label="50K 行" :value="50000" />
              <el-option label="100K 行" :value="100000" />
            </el-select>
          </div>

          <div class="control-group">
            <label>列数：</label>
            <el-select v-model="columnCount" @change="updateColumnCount">
              <el-option label="5 列" :value="5" />
              <el-option label="10 列" :value="10" />
              <el-option label="20 列" :value="20" />
              <el-option label="50 列" :value="50" />
            </el-select>
          </div>

          <div class="control-group">
            <label>表格类型：</label>
            <el-select v-model="tableType" @change="updateTableType">
              <el-option label="虚拟化表格" value="virtual" />
              <el-option label="普通表格" value="normal" />
            </el-select>
          </div>
        </div>

        <div class="test-buttons">
          <el-button @click="testScrollPerformance" :loading="isScrolling">
            滚动性能测试
          </el-button>
          <el-button @click="testUpdatePerformance" :loading="isUpdating">
            更新性能测试
          </el-button>
          <el-button @click="clearPerformanceData"> 清除数据 </el-button>
        </div>
      </el-card>

      <!-- 性能历史图表 -->
      <el-card class="chart-card">
        <template #header>
          <span>性能历史</span>
        </template>
        <div ref="chartContainer" class="chart-container"></div>
      </el-card>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-card>
        <template #header>
          <div class="table-header">
            <span
              >{{
                tableType === 'virtual' ? '虚拟化表格' : '普通表格'
              }}
              性能测试</span
            >
            <el-tag :type="tableType === 'virtual' ? 'success' : 'warning'">
              {{ tableType === 'virtual' ? '虚拟化' : '普通' }}
            </el-tag>
          </div>
        </template>

        <!-- 虚拟化表格 -->
        <el-table-v2
          v-if="tableType === 'virtual'"
          ref="virtualTable"
          :columns="columns"
          :data="data"
          :width="tableWidth"
          :height="tableHeight"
          fixed
          :estimated-row-height="40"
          @scroll="handleScroll"
        />

        <!-- 普通表格 -->
        <el-table
          v-else
          ref="normalTable"
          :data="data.slice(0, Math.min(data.length, 1000))"
          :height="tableHeight"
          border
          table-layout="auto"
          @scroll="handleScroll"
        >
          <el-table-column
            v-for="column in columns.slice(0, Math.min(columns.length, 10))"
            :key="column.dataKey"
            :prop="column.dataKey"
            :label="column.title"
            :width="150"
          />
        </el-table>
      </el-card>
    </div>

    <!-- 测试结果显示 -->
    <div v-if="testResults.length > 0" class="results-container">
      <el-card>
        <template #header>
          <span>测试结果</span>
        </template>

        <el-table :data="testResults" border>
          <el-table-column prop="testName" label="测试项目" />
          <el-table-column prop="dataSize" label="数据量" />
          <el-table-column prop="tableType" label="表格类型" />
          <el-table-column prop="duration" label="耗时(ms)" />
          <el-table-column prop="fps" label="平均FPS" />
          <el-table-column prop="memory" label="内存使用(MB)" />
          <el-table-column prop="timestamp" label="测试时间">
            <template #default="{ row }">
              {{ new Date(row.timestamp).toLocaleTimeString() }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'

// 定义类型接口
interface Column {
  key: string
  dataKey: string
  title: string
  width: number
  [key: string]: any
}

interface TableRow {
  id: string
  parentId: string | null
  [key: string]: any
}

interface FPSHistoryItem {
  time: number
  fps: number
}

interface TestResult {
  testName: string
  dataSize: number
  tableType: string
  duration: number
  fps: number
  memory: number
  timestamp: number
}

// 扩展 Performance 接口以支持 memory 属性
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

// 响应式数据
const currentFPS = ref<number>(60)
const memoryUsage = ref<number>(0)
const renderTime = ref<number>(0)
const isTesting = ref<boolean>(false)
const isScrolling = ref<boolean>(false)
const isUpdating = ref<boolean>(false)

// 表格配置
const dataSize = ref<number>(10000)
const columnCount = ref<number>(10)
const tableType = ref<'virtual' | 'normal'>('virtual')
const tableWidth = ref<number>(1200)
const tableHeight = ref<number>(600)

// 表格数据
const columns = ref<Column[]>([])
const data = ref<TableRow[]>([])

// 性能监控
const fpsHistory = ref<FPSHistoryItem[]>([])
const testResults = ref<TestResult[]>([])

// FPS 监控相关
let frameCount = 0
let lastTime = performance.now()
let fpsInterval: number | null = null

// 生成列配置
const generateColumns = (
  length = 10,
  prefix = 'column-',
  props?: any
): Column[] =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `列 ${columnIndex + 1}`,
    width: 150
  }))

// 生成数据
const generateData = (
  columns: Column[],
  length = 200,
  prefix = 'row-'
): TableRow[] =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `行${rowIndex + 1}-列${columnIndex + 1}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      } as TableRow
    )
  })

// FPS 分类样式
const getFPSClass = (fps: number) => {
  if (fps >= 55) return 'fps-excellent'
  if (fps >= 45) return 'fps-good'
  if (fps >= 30) return 'fps-fair'
  return 'fps-poor'
}

// 获取内存使用情况
const getMemoryUsage = (): number => {
  const perf = performance as PerformanceWithMemory
  if (perf.memory) {
    return Math.round(perf.memory.usedJSHeapSize / 1024 / 1024)
  }
  return 0
}

// 开始 FPS 监控
const startFPSMonitoring = (): void => {
  fpsInterval = setInterval(() => {
    frameCount++
    const currentTime = performance.now()

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      currentFPS.value = fps

      // 记录 FPS 历史
      fpsHistory.value.push({
        time: currentTime,
        fps: fps
      })

      // 只保留最近 60 秒的数据
      if (fpsHistory.value.length > 60) {
        fpsHistory.value.shift()
      }

      frameCount = 0
      lastTime = currentTime
    }

    // 更新内存使用
    memoryUsage.value = getMemoryUsage()
  }, 100)
}

// 停止 FPS 监控
const stopFPSMonitoring = (): void => {
  if (fpsInterval) {
    clearInterval(fpsInterval)
    fpsInterval = null
  }
}

// 更新数据量
const updateDataSize = (): void => {
  const startTime = performance.now()
  data.value = generateData(columns.value, dataSize.value)

  nextTick(() => {
    const endTime = performance.now()
    renderTime.value = Math.round(endTime - startTime)
  })
}

// 更新列数
const updateColumnCount = (): void => {
  const startTime = performance.now()
  columns.value = generateColumns(columnCount.value)
  data.value = generateData(columns.value, dataSize.value)

  nextTick(() => {
    const endTime = performance.now()
    renderTime.value = Math.round(endTime - startTime)
  })
}

// 更新表格类型
const updateTableType = (): void => {
  // 表格类型切换时的处理逻辑
}

// 滚动性能测试
const testScrollPerformance = async (): Promise<void> => {
  isScrolling.value = true
  const startTime = performance.now()

  try {
    // 模拟快速滚动
    const table =
      tableType.value === 'virtual'
        ? document.querySelector('.el-table-v2__body')
        : document.querySelector('.el-table__body-wrapper')

    if (table) {
      // 执行滚动测试
      for (let i = 0; i < 10; i++) {
        table.scrollTop = i * 100
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>(resolve => {
          setTimeout(() => resolve(), 100)
        })
      }
    }
  } finally {
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    // 记录测试结果
    const testResult: TestResult = {
      testName: '滚动性能测试',
      dataSize: dataSize.value,
      tableType: tableType.value,
      duration: duration,
      fps: currentFPS.value,
      memory: memoryUsage.value,
      timestamp: Date.now()
    }
    testResults.value.push(testResult)

    isScrolling.value = false
  }
}

// 更新性能测试
const testUpdatePerformance = async (): Promise<void> => {
  isUpdating.value = true
  const startTime = performance.now()

  try {
    // 模拟数据更新
    for (let i = 0; i < 5; i++) {
      const newData = generateData(
        columns.value,
        dataSize.value,
        `update-${i}-`
      )
      data.value = newData
      // eslint-disable-next-line no-await-in-loop
      await nextTick()
      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 100)
      })
    }
  } finally {
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    // 记录测试结果
    const testResult: TestResult = {
      testName: '更新性能测试',
      dataSize: dataSize.value,
      tableType: tableType.value,
      duration: duration,
      fps: currentFPS.value,
      memory: memoryUsage.value,
      timestamp: Date.now()
    }
    testResults.value.push(testResult)

    isUpdating.value = false
  }
}

// 开始性能测试
const startPerformanceTest = async (): Promise<void> => {
  isTesting.value = true

  try {
    // 测试不同数据量的性能
    const testSizes = [1000, 5000, 10000, 50000]

    for (const size of testSizes) {
      dataSize.value = size
      updateDataSize()

      // 等待渲染完成
      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 1000)
      })

      // 记录测试结果
      const testResult: TestResult = {
        testName: '数据量性能测试',
        dataSize: size,
        tableType: tableType.value,
        duration: renderTime.value,
        fps: currentFPS.value,
        memory: memoryUsage.value,
        timestamp: Date.now()
      }
      testResults.value.push(testResult)
    }
  } finally {
    isTesting.value = false
  }
}

// 清除性能数据
const clearPerformanceData = (): void => {
  testResults.value = []
  fpsHistory.value = []
  currentFPS.value = 60
  memoryUsage.value = 0
  renderTime.value = 0
}

// 处理滚动事件
const handleScroll = (): void => {
  // 滚动时的性能监控
}

// 初始化
const init = (): void => {
  columns.value = generateColumns(columnCount.value)
  data.value = generateData(columns.value, dataSize.value)
  startFPSMonitoring()
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  stopFPSMonitoring()
})
</script>

<style scoped>
.performance-test-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.performance-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
  margin-bottom: 20px;
}

.stats-card {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.fps-excellent {
  color: #67c23a;
}
.fps-good {
  color: #e6a23c;
}
.fps-fair {
  color: #f56c6c;
}
.fps-poor {
  color: #909399;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-weight: 500;
  color: #333;
}

.test-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chart-card {
  grid-column: 1 / -1;
}

.chart-container {
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.table-container {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-container {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .performance-panel {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .control-grid {
    grid-template-columns: 1fr;
  }
}
</style>
