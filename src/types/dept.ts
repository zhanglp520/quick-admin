export interface Dept {
  id: string | undefined
  deptId: string
  deptName: string
  pId: number | string
}
export interface DeptTree extends Dept {
  children: DeptTree[]
}
