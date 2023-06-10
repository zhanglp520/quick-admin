export interface Menu {
  id: string | undefined
  menuId: string
  menuName: string
  path: string
  viewPath: string
  menuType: number
  icon: string
  sort: number
  pId: string
  link: number
  linkUrl: string
  enabled: boolean
  status: boolean
}
export interface MenuTree extends Menu {
  children: MenuTree[]
}
export interface Menubar extends Menu {
  children: Menubar[]
}
