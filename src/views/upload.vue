<template>
  <div class="container">
    <h2>支持拖拽</h2>
    <el-upload
      class="upload-demo"
      drag
      action="http://localhost:3000/userImg"
      multiple
      :on-change="handleFileChange"
      :on-success="handleSuccess"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <h2>测试自定义上传</h2>
    <el-upload
      class="upload-demo"
      action="#"
      multiple
      :http-request="customUpload"
    >
      <el-button type="primary">Click to upload</el-button>
    </el-upload>
    <h4 v-if="result">文件展示:</h4>
    <img v-if="result" :src="result.url" style="width: 200px; height: 200px" />
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { uploadFileBase64 } from '@/api'

const selectedFile = ref<File | null>(null)

const handleFileChange = (file: any, files: any) => {
  // 检查文件大小 (10MB限制)
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过 10MB')
    return
  }

  selectedFile.value = file.raw
  console.log(selectedFile.value)
  console.log('filsesssss', files)
}

const handleSuccess = (response: any, file: any, files: any) => {
  console.log('response', response)
  console.log('file', file)
  console.log('files', files)
}

/**
 * 自定义上传函数 传统的其实很方便就是替你发送一个post请求 然后将文件作为请求体参数（content-type:multipart/form-data）
 * 发送到action所表示的地址，然后你在各种狗子里拿到response就可以用了
 */
// 自定义上传，拓展更多，比如现在由于json-server不支持上传文件，我们可以把文件转换为base64(字符串) 然后以json格式发送给json-server存储
const result = ref()
const customUpload = async (options: any) => {
  try {
    // 将文件转换为base64存储到json-server
    // 示例：转换为base64存储
    const file = options.file
    const reader = new FileReader()
    reader.onload = async e => {
      const base64 = e.target?.result

      // 存储到json-server的userImg表
      const response = await uploadFileBase64({
        url: base64,
        filename: file.name,
        size: file.size
      })
      console.log('response', response)
      result.value = response.data
    }
    reader.readAsDataURL(file)
  } catch (error) {
    ElMessage.error('上传失败')
    options.onError()
  }
}
</script>

<style scoped>
h2 {
  color: #1f2f3d;
}

.upload-demo {
  width: 360px;
}
</style>
