<template>
  <el-form :model="formData" :label-width="labelWidth" ref="formRef">
    <el-row>
      <el-col :span="span" v-for="item in options" :key="item.prop">
        <el-form-item :label="item.label" :prop="item.prop">
          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          ></el-input>

          <el-input-number
            v-else-if="item.type === 'number'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            controls-position="right"
          ></el-input-number>

          <el-select
            v-else-if="item.type === 'select'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="opt in item.opts"
              :label="opt.label"
              :value="opt.value"
              :key="opt.value"
            ></el-option>
          </el-select>

          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="formData[item.prop]"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
          ></el-switch>

          <el-upload
            v-else-if="item.type === 'upload'"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
          >
            <img
              v-if="formData[item.prop]"
              :src="formData[item.prop] as string"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <slot :name="item.prop" v-else></slot>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { FormRules, FormInstance } from "element-plus";
import { Edit, Plus } from "@element-plus/icons-vue";
import { FormEditProps } from "@/types";
import { addTableList, updateTableList } from "@/api";

const props = defineProps<FormEditProps>();

// fix 目前先不用rules
const rules: FormRules = props.options
  .map((item) => {
    if (item.required) {
      return {
        [item.prop]: [
          { required: true, message: `${item.label}不能为空`, trigger: "blur" },
        ],
      };
    }
    return {};
  })
  .reduce((acc, cur) => ({ ...acc, ...cur }));

// 提交表单
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    // fix upload
    // if (!valid) return;
    props.edit
      ? await updateTableList(props.formData)
      : await addTableList(props.formData);
    props.update();
  });
};
</script>

<style scoped>
.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
