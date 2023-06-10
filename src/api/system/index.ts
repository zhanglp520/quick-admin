import { defaultVersion } from '../index'
/*
 *@Description: 系统管理模块api
 *@Author: 土豆哥
 *@Date: 2022-11-28 11:54:32
 */
const parentModule = '/system'
const api = `${defaultVersion}${parentModule}`
export const user = `${api}/users`
export const role = `${api}/roles`
export const dept = `${api}/depts`
export const menu = `${api}/menus`
export const dictionary = `${api}/dictionaries`
export const dictionaryType = `${api}/dictionaryTypes`
export const log = `${api}/logs`
