<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item v-for="item in props.list" :key="item.prop">
      <template #label> {{ item.label }} </template>
      <slot :name="item.prop" :rows="props.row">
        {{ props.row[item.prop] }}
      </slot>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { TableDetailProps } from '@/types'
const props = defineProps<TableDetailProps>()
</script>
