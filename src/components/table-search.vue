<template>
  <div class="search-container">
    <el-form :model="query" :inline="true">
      <el-form-item
        v-for="item in options"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
      >
        <el-input
          v-if="item.type == 'input'"
          v-model="query[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          clearable
        />
        <el-select
          v-else-if="item.type == 'select'"
          v-model="query[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          clearable
          @change="handleSelectChange"
          style="width: 100px"
        >
          <el-option
            v-for="opt in item.opts"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import { SearchTableProps } from "@/types";
const props = withDefaults(defineProps<SearchTableProps>(), {
  search: () => {
    console.log("search success");
  },
  reset: () => {
    console.log("reset success");
  },
});

const handleSelectChange = (value: any) => {
  console.log("下拉框选择变化:", value);
};
</script>

<style scoped>
.search-container {
  padding: 20px 30px 0;
  background-color: #fff;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
