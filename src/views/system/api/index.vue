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
  PermissionButton,
} from '@ainiteam/quick-vue3-ui'
import { validatePermission } from '@/utils'
import { Api, SearchApi } from '@/types/api'
import { useUserStore } from '@/store/modules/user'
import {
  getApiPageList,
  addApi,
  updateApi,
  deleteApi,
  batchDeleteApi,
} from '@/api/system/api'

/**
 * 属性
 */
const userStore = useUserStore()
const loading = ref(false)
const dataList = reactive<Array<Api>>([])
const permissionBtn = computed<PermissionButton>(() => {
  return userStore.getPermissionBtns as PermissionButton
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
const searchForm = reactive<SearchApi>({
  keyword: '',
})
const searchFormItems = reactive<Array<FormItem>>([
  {
    label: '',
    vModel: 'keyword',
    placeholder: '接口名称|菜单名称',
  },
])
/**
 * 工具栏
 */
const handleBatchDelete = (data: any, done: any) => {
  const { ids } = data
  ElMessageBox.confirm(`你真的删除选择的接口吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchDeleteApi(ids).then(() => {
      ElMessage({
        type: 'success',
        message: '接口删除成功',
      })
      done()
    })
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
  // position: 'right',
  hiddenBatchDeleteButton: true,
  hiddenImportButton: true,
  hiddenExportButton: true,
  hiddenPrintButton: true,
  hiddenAddButton: validatePermission(permissionBtn.value?.add),
})
/**
 * 操作栏
 */
const handleDelete = (item: Api, done: any) => {
  ElMessageBox.confirm(`你真的删除【${item.apiName}】的接口吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (!item.id) {
      return
    }
    deleteApi(item.id).then(() => {
      ElMessage({
        type: 'success',
        message: '接口删除成功',
      })
      done()
    })
  })
}

const tableActionbar = reactive<Actionbar>({
  width: 150,
  hiddenEditButton: validatePermission(permissionBtn.value?.edit),
  hiddenDeleteButton: validatePermission(permissionBtn.value?.delete),
  hiddenDetailButton: validatePermission(permissionBtn.value?.detail),
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
    label: '接口编号',
    prop: 'apiId',
    width: '200',
  },
  {
    label: '接口名称',
    prop: 'apiName',
    width: '200',
  },
  {
    label: '接口地址',
    prop: 'apiPath',
    width: '300',
  },
  {
    label: '创建时间',
    prop: 'createTime',
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
  getApiPageList(parmas)
    .then((res) => {
      loading.value = false
      const { data: apiList, total } = res
      if (apiList) {
        dataList.length = 0
        dataList.push(...apiList)
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
  add: '添加接口',
  edit: '编辑接口',
  detail: '接口详情',
})
const formModel = reactive<Api>({
  id: '',
  apiId: '',
  apiName: '',
  apiPath: '',
  remark: '',
})
const formItems = reactive<Array<FormItem>>([
  {
    label: '接口编号',
    labelWidth: '80px',
    vModel: 'apiId',
    editReadonly: true,
    placeholder: '接口编号',
    prop: 'apiId',
    rules: [
      {
        required: true,
        message: '接口编号不能为空',
        trigger: 'blur',
      },
    ],
  },
  {
    label: '接口名称',
    labelWidth: '80px',
    vModel: 'apiName',
    placeholder: '接口名称',
    prop: 'apiName',
    rules: [
      {
        required: true,
        message: '接口名称不能为空',
        trigger: 'blur',
      },
    ],
  },
  {
    label: '接口地址',
    labelWidth: '80px',
    vModel: 'apiPath',
    placeholder: '接口地址,例如：/api/v2/system/depts',
    prop: 'apiPath',
    rules: [
      {
        required: true,
        message: '接口地址不能为空',
        trigger: 'blur',
      },
    ],
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
const handleFormSubmit = (form: Api, done: any) => {
  const row = { ...form }
  if (row.id) {
    updateApi(row).then(() => {
      ElMessage({
        type: 'success',
        message: '接口修改成功',
      })
      done()
    })
  } else {
    row.id = undefined
    addApi(row).then(() => {
      ElMessage({
        type: 'success',
        message: '接口创建成功',
      })
      done()
    })
  }
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
    @on-print="handlePrint"
  ></quick-crud>
</template>
