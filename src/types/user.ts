import { PermissionButton } from '@ainiteam/quick-vue3-ui'

export interface User {
  id: string | undefined
  userId: string
  userName: string
  password?: string
  deleted?: number
  enabled?: number
  createTime?: string
  avatar?: string
  fullName?: string
  phone?: string
  email?: string
  address?: string
  remark?: string
}
export interface SearchUser {
  keyword: string
}
export interface ChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword?: string
}

export interface UserPermissionButton extends PermissionButton {
  resetPassword?: boolean
}
