<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Column,
  FormItem,
  Page,
  Actionbar,
  Toolbar,
} from '@ainiteam/quick-vue3-ui'
import { validatePermission } from '@/utils'
import { downloadExcel, exportExcel } from '@/utils/download'
import { User, SearchUser, UserPermissionButton } from '@/types/user'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'
import { downloadFileStream } from '@/api/common'
import {
  exportUser,
  getUserPageList,
  addUser,
  updateUser,
  deleteUser,
  batchDeleteUser,
  resetUserPassword,
  enableUser,
  disableUser,
} from '@/api/system/user'

/**
 * 属性
 */
const loginStore = useAuthStore()
const userStore = useUserStore()
const loading = ref(false)
const dataList = reactive<Array<User>>([])
const uploadRef = ref<HTMLElement | null>(null)
const permissionBtn = computed<UserPermissionButton>(() => {
  return userStore.getPermissionBtns as UserPermissionButton
})

/**
 * 分页
 */
const page = reactive<Page>({
  current: 1,
  size: 10,
  sizes: [10, 20, 30, 40, 50],
  total: 0,
})
/**
 * 搜索
 */
const searchForm = reactive<SearchUser>({
  keyword: '',
})
const searchFormItems = reactive<Array<FormItem>>([
  {
    label: '',
    vModel: 'keyword',
    placeholder: '用户名|手机号',
  },
])
/**
 * 工具栏
 */
const handleBatchDelete = (data: any, done: any) => {
  const { ids } = data
  ElMessageBox.confirm(`你真的删除选择的用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchDeleteUser(ids).then(() => {
      ElMessage({
        type: 'success',
        message: '用户删除成功',
      })
      done()
    })
  })
}
const handleExport = () => {
  exportUser().then((res) => {
    downloadExcel(res, '用户列表')
  })
}
const handlePrint = () => {
  window.print()
}
const changeFile = (event: any) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = (e: any) => {
    const data = e.target.result
    const workbook = XLSX.read(data, { type: 'binary', cellDates: true })
    const wsname = workbook.SheetNames[0]
    const outdata = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
    console.log(outdata, 'outdata')
  }
}

const tableToolbar = reactive<Toolbar>({
  importButtonName: '导入（默认后端方式）',
  exportButtonName: '导出（默认后端方式）',
  hiddenBatchDeleteButton: validatePermission(permissionBtn.value?.batchDelete),
  hiddenImportButton: validatePermission(permissionBtn.value?.import),
  hiddenExportButton: validatePermission(permissionBtn.value?.export),
  hiddenAddButton: validatePermission(permissionBtn.value?.add),
  hiddenPrintButton: validatePermission(permissionBtn.value?.print),
  position: 'right',
  btns: [
    {
      name: '下载模板(浏览器下载方式)',
      position: 'left',
      type: 'warning',
      hidden: validatePermission(permissionBtn.value?.download),
      click() {
        window.location.href = `${
          import.meta.env.VITE_APP_BASE_URL
        }/api/v2/downloads?filePath=templates/用户模板.xlsx`
      },
    },
    {
      name: '下载模板(流文件方式)',
      position: 'left',
      type: 'success',
      hidden: validatePermission(permissionBtn.value?.download),
      click() {
        downloadFileStream('templates/用户模板.xlsx').then((res) => {
          downloadExcel(res, '用户导入模板')
        })
      },
    },
    {
      name: '导入(前端方式)',
      position: 'left',
      type: 'warning',
      hidden: validatePermission(permissionBtn.value?.import),
      click() {
        const fileBtn = uploadRef.value as HTMLInputElement
        fileBtn.click()
      },
    },
    {
      name: '导出(前端方式)',
      position: 'left',
      type: 'danger',
      hidden: validatePermission(permissionBtn.value?.export),
      click() {
        // 导出的字段映射
        const columns = [
          {
            label: '编号',
            value: 'id',
          },
          {
            label: '用户编号',
            value: 'userId',
          },
          {
            label: '用户名',
            value: 'userName',
          },
          {
            label: '姓名',
            value: 'fullName',
          },
          {
            label: '手机号',
            value: 'phone',
          },
          {
            label: '邮箱',
            value: 'email',
          },
          {
            label: '地址',
            value: 'address',
          },
        ]
        exportExcel(dataList, '用户列表', columns)
      },
    },
  ],
})
/**
 * 操作栏
 */
const handleDelete = (item: User, done: any) => {
  ElMessageBox.confirm(`你真的删除【${item.userName}】的用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (!item.id) {
      return
    }
    deleteUser(item.id).then(() => {
      ElMessage({
        type: 'success',
        message: '用户删除成功',
      })
      done()
    })
  })
}
const handleResetPassword = (item: User, done: any) => {
  ElMessageBox.confirm(`你真的重置【${item.userName}】用户的密码吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (!item.id) {
      return
    }
    resetUserPassword(item.id).then(() => {
      ElMessage({
        type: 'success',
        message: '置用户密码重成功',
      })
      done()
    })
  })
}
const handleEnable = (item: User, done: any) => {
  ElMessageBox.confirm(`你真的启用【${item.userName}】的用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (!item.id) {
      return
    }
    enableUser(item.id).then(() => {
      ElMessage({
        type: 'success',
        message: '用户启用成功',
      })
      done()
    })
  })
}
const handleDisable = (item: User, done: any) => {
  ElMessageBox.confirm(`你真的禁用【${item.userName}】的用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (!item.id) {
      return
    }
    disableUser(item.id).then(() => {
      ElMessage({
        type: 'success',
        message: '用户禁用成功',
      })
      done()
    })
  })
}
const tableActionbar = reactive<Actionbar>({
  width: 300,
  hiddenEditButton: validatePermission(permissionBtn.value?.edit),
  hiddenDeleteButton: validatePermission(permissionBtn.value?.delete),
  hiddenDetailButton: validatePermission(permissionBtn.value?.detail),
  btns: [
    {
      name: '重置密码',
      hidden: validatePermission(permissionBtn.value?.resetPassword),
      click(item: User, done: any) {
        handleResetPassword(item, done)
      },
    },
    {
      name: '启用',
      hidden: validatePermission(permissionBtn.value?.enabled),
      click(item: User, done: any) {
        handleEnable(item, done)
      },
      render(row: User) {
        return row.enabled === 0
      },
    },
    {
      name: '禁用',
      hidden: validatePermission(permissionBtn.value?.disabled),
      click(item: User, done: any) {
        handleDisable(item, done)
      },
      render(row: User) {
        return row.enabled !== 0
      },
    },
  ],
})
/**
 * 表格
 */
const tableColumns = reactive<Array<Column>>([
  {
    width: '50',
    type: 'selection',
  },
  {
    width: '60',
    type: 'index',
    label: '序号',
  },
  {
    label: '用户编号',
    prop: 'userId',
    width: '100',
  },
  {
    label: '用户名',
    prop: 'userName',
    width: '100',
  },
  {
    label: '姓名',
    prop: 'fullName',
    width: '100',
  },
  {
    label: '手机号',
    prop: 'phone',
    width: '180',
  },
  {
    label: '邮箱',
    prop: 'email',
    width: '200',
  },
  {
    label: '是否启用',
    prop: 'enabled',
    width: '200',
    format: (row: User) => {
      return row.enabled === 1 ? '启用' : '禁用'
    },
  },
  {
    label: '创建时间',
    prop: 'createTime',
    width: '200',
  },
  {
    label: '地址',
    prop: 'address',
    width: '200',
  },
  {
    label: '备注',
    prop: 'remark',
  },
])
/**
 * 加载数据
 */
const load = (parmas: object) => {
  loading.value = true
  getUserPageList(parmas)
    .then((res) => {
      loading.value = false
      const { data: userList, total } = res
      if (userList) {
        dataList.length = 0
        dataList.push(...userList)
      }
      page.total = total
    })
    .catch(() => {
      loading.value = false
    })
}
/**
 * 表单
 */
const dialogTitle = reactive({
  add: '添加用户',
  edit: '编辑用户',
  detail: '用户详情',
})
const validateUserId = (rule: any, value: string, callback: any) => {
  const reg = /^YH_\d+$/
  if (!reg.test(value)) {
    callback(new Error('用户编号必须是以YH_开头和数字组合'))
  } else {
    callback()
  }
}
const validateUserName = (rule: any, value: string, callback: any) => {
  const reg = /^[a-zA-Z0-9]{4,16}$/
  if (!reg.test(value)) {
    callback(new Error('用户必须是4-16位的字母、数字'))
  } else {
    callback()
  }
}
const validateFullName = (rule: any, value: string, callback: any) => {
  const reg = /^[\u4e00-\u9fa5]{2,4}$/
  if (!value) {
    callback()
  } else if (!reg.test(value)) {
    callback(new Error('非法姓名'))
  } else {
    callback()
  }
}
const validatePhone = (rule: any, value: string, callback: any) => {
  const reg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (!value) {
    callback()
  } else if (!reg.test(value)) {
    callback(new Error('非法手机号'))
  } else {
    callback()
  }
}
const validateEmail = (rule: any, value: string, callback: any) => {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!value) {
    callback()
  } else if (!reg.test(value)) {
    callback(new Error('非法邮箱'))
  } else {
    callback()
  }
}
const formModel = reactive<User>({
  id: '',
  userId: '',
  userName: '',
  fullName: '',
  phone: '',
  email: '',
  address: '',
  remark: '',
})
const formItems = reactive<Array<FormItem>>([
  {
    label: '用户编号',
    labelWidth: '80px',
    vModel: 'userId',
    editReadonly: true,
    placeholder: '用户编号',
    prop: 'userId',
    rules: [
      {
        required: true,
        message: '用户编号不能为空',
        trigger: 'blur',
      },
      {
        validator: validateUserId,
        trigger: 'blur',
      },
    ],
  },
  {
    label: '用户名',
    labelWidth: '80px',
    vModel: 'userName',
    placeholder: '用户名',
    prop: 'userName',
    rules: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'blur',
      },
      {
        validator: validateUserName,
        trigger: 'blur',
      },
    ],
  },
  {
    label: '姓名',
    labelWidth: '80px',
    vModel: 'fullName',
    placeholder: '姓名',
    prop: 'fullName',
    rules: [
      {
        validator: validateFullName,
        trigger: 'blur',
      },
    ],
  },
  {
    label: '手机号',
    labelWidth: '80px',
    vModel: 'phone',
    placeholder: '手机号',
    prop: 'phone',
    rules: [
      {
        validator: validatePhone,
        trigger: 'blur',
      },
    ],
  },
  {
    label: '邮箱',
    labelWidth: '80px',
    vModel: 'email',
    placeholder: '邮箱',
    prop: 'email',
    rules: [
      {
        validator: validateEmail,
        trigger: 'blur',
      },
    ],
  },
  {
    label: '地址',
    labelWidth: '80px',
    vModel: 'address',
    placeholder: '地址',
    prop: 'address',
  },
  {
    label: '备注',
    labelWidth: '80px',
    vModel: 'remark',
    placeholder: '备注',
    type: 'textarea',
    prop: 'remark',
  },
])
const handleFormSubmit = (form: User, done: any) => {
  const row = { ...form }
  if (row.id) {
    updateUser(row).then(() => {
      ElMessage({
        type: 'success',
        message: '用户修改成功',
      })
      done()
    })
  } else {
    row.id = undefined
    addUser(row).then(() => {
      ElMessage({
        type: 'success',
        message: '用户创建成功',
      })
      done()
    })
  }
}
/**
 * 导入
 */
const dialogVisible = ref(false)
const action = `${
  import.meta.env.VITE_APP_BASE_URL
}/api/v2/system/users/importUser`
const headers = reactive({
  authorization: `Bearer ${loginStore.getAccessToken}`,
})
const handleImport = (done: any) => {
  dialogVisible.value = true
}
const handleSuccess = (data: any) => {
  // const {
  //   response,
  //   uploadFile,
  //   uploadFiles
  // }=data
  ElMessage({
    type: 'success',
    message: '导入用户成功.',
  })
  dialogVisible.value = false
  load({
    keyword: '',
    current: 1,
    size: 10,
  })
}
const handleError = () => {
  ElMessage({
    type: 'success',
    message: '导入用户失败.',
  })
  dialogVisible.value = false
}
const handleClose = () => {
  dialogVisible.value = false
}
</script>
<template>
  <quick-crud
    :dialog-title="dialogTitle"
    :form-model="formModel"
    :form-items="formItems"
    :table-data="dataList"
    :table-columns="tableColumns"
    :table-actionbar="tableActionbar"
    :table-toolbar="tableToolbar"
    :search-form-items="searchFormItems"
    :search-form-model="searchForm"
    dialog-titles="dialogTitles"
    :page="page"
    :loading="loading"
    @on-load="load"
    @on-form-submit="handleFormSubmit"
    @on-delete="handleDelete"
    @on-batch-delete="handleBatchDelete"
    @on-import="handleImport"
    @on-export="handleExport"
    @on-print="handlePrint"
  ></quick-crud>
  <quick-upload
    :dialog-visible="dialogVisible"
    :action="action"
    :headers="headers"
    @on-success="handleSuccess"
    @on-error="handleError"
    @on-close="handleClose"
  ></quick-upload>
  <input
    ref="uploadRef"
    style="display: none"
    type="file"
    accept=".xls,.xlsx"
    class="upload-file"
    @change="changeFile($event)"
  />
</template>
