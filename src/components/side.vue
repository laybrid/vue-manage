<template>
    <div class="side">
        <el-menu background-color="#324157" text-color="#fff" router>
            <template v-for="item in menuData" :key="item.id">
                <el-sub-menu v-if="item.children" :index="item.index">
                    <template #title>
                        <component :is="iconMap[item.icon]" class="icon"></component>
                        <span>{{ item.title }}</span>
                    </template>
                    <template v-for="child in item.children" :key="child.id">
                        <el-menu-item :index="child.index">
                            {{ child.title }}
                        </el-menu-item>
                    </template>
                </el-sub-menu>
                <el-menu-item :index="item.index" v-else>
                    <component :is="iconMap[item.icon]" class="icon"></component>
                    <template #title>{{ item.title }}</template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang='ts'>
import { menuData } from './menu'
import { HomeIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import type { Component } from 'vue'

// 创建图标映射对象
const iconMap: Record<string, Component> = {
    'HomeIcon': HomeIcon,
    'CalendarIcon': CalendarIcon
}
</script>

<style scoped>
.side {
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background-color: #324157;
}
.icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
}
</style>
