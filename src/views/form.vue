<template>
  <div class="container">
    <el-radio-group
      v-model="labelPosition"
      size="large"
      style="margin-bottom: 20px"
    >
      <el-radio-button label="left" value="left" />
      <el-radio-button label="right" value="right" />
      <el-radio-button label="top" value="top" />
    </el-radio-group>

    <el-form
      :label-position="labelPosition"
      label-width="100px"
      ref="formRef"
      :model="form"
      :rules="rules"
    >
      <el-row :gutter="50">
        <el-col :span="10">
          <el-form-item label="文本框" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="数字框" prop="num">
            <el-input-number :min="1" :max="10" v-model="form.num" />
          </el-form-item>

          <el-form-item label="日期选择" prop="date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.date"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="时间选择" prop="time">
            <el-time-picker placeholder="选择时间" v-model="form.time">
            </el-time-picker>
          </el-form-item>

          <el-form-item label="下拉菜单" prop="region">
            <el-select placeholder="请选择" v-model="form.region">
              <el-option key="小明" label="小明" value="小明"></el-option>
              <el-option key="小红" label="小红" value="小红"></el-option>
              <el-option key="小白" label="小白" value="小白"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="城市级联" prop="options">
            <el-cascader
              v-model="form.options"
              :options="options"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="文本框" prop="desc">
            <el-input type="textarea" :rows="5" v-model="form.desc"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评分" prop="rate">
            <el-rate allow-half v-model="form.rate" />
          </el-form-item>

          <el-form-item label="滑块" prop="num">
            <el-slider :step="1" show-stops :max="10" v-model="form.num" />
          </el-form-item>

          <el-form-item label="颜色选择" prop="color">
            <el-color-picker v-model="form.color" />
          </el-form-item>

          <el-form-item label="多选框" prop="type">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="小明" value="小明" name="type"></el-checkbox>
              <el-checkbox label="小红" value="小红" name="type"></el-checkbox>
              <el-checkbox label="小白" value="小白" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="单选框" prop="resource">
            <el-radio-group v-model="form.resource">
              <el-radio label="小明" value="小明"></el-radio>
              <el-radio label="小红" value="小红"></el-radio>
              <el-radio label="小白" value="小白"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="end">
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)"
            >表单提交</el-button
          >
          <el-button @click="resetForm(formRef)">重置表单</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { submitFormData } from "@/api";

const labelPosition = ref("left");
const formRef = ref<FormInstance>();

const rules: FormRules = {
  name: [{ required: true, message: "请输入表单名称", trigger: "blur" }],
};
const form = reactive({
  name: "",
  region: "",
  date: "",
  time: "",
  type: ["小明"],
  resource: "小红",
  desc: "",
  options: [],
  color: "",
  num: 1,
  rate: 0,
});
const options = [
  {
    value: "guangdong",
    label: "广东省",
    children: [
      {
        value: "guangzhou",
        label: "广州市",
        children: [
          {
            value: "tianhe",
            label: "天河区",
          },
          {
            value: "haizhu",
            label: "海珠区",
          },
        ],
      },
      {
        value: "dongguan",
        label: "东莞市",
        children: [
          {
            value: "changan",
            label: "长安镇",
          },
          {
            value: "humen",
            label: "虎门镇",
          },
        ],
      },
    ],
  },
  {
    value: "hunan",
    label: "湖北省",
    children: [
      {
        value: "wuhan",
        label: "武汉市",
        children: [
          {
            value: "hongshan",
            label: "洪山区",
          },
        ],
      },
    ],
  },
];

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(form);

      // 验证通过之后可以把form作为json格式参数发送post请求给服务端
      submitFormData(form);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
