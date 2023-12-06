import request from '@/util/request.ts'
enum API {
    GETALLMENU_URL = '/admin/acl/permission',
    ADDMENU_URL = '/admin/acl/permission/save',
    UPDATEMENU_URL = '/admin/acl/permission/update',
    REMOVEMENU_URL = '/admin/acl/permission/remove/'
}
export const reqMenu = () => { return request.get(API.GETALLMENU_URL) }
// 添加与更新菜单
export const reqAddOrUpdateMenu = (menu: any) => {
    if (menu.id) {
        return request.put(API.UPDATEMENU_URL, menu)
    } else {
        return request.post(API.ADDMENU_URL, menu)
    }
}
export const reqRemoveMenu = (id: number) => { return request.delete(API.REMOVEMENU_URL + id) }