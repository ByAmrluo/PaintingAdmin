import request from '@/util/request.ts'
enum API {

    GETMENULIST = '/role/roleMenu/',
    ASSIGNACL_URL = '/role/',
    DELETEROLE_URL = '/role/',
    // 获取所有的角色信息
    GETROLEPAGE_URL = '/role/page',
    // 添加角色信息
    ADDROLE_URL = '/role',
    GETALLMENU = '/menu/list'

}
export const reqRoleList = (page: number, limit: number, roleName) => {
    console.log(roleName == undefined);

    if (roleName) {

        return request.get(API.GETROLEPAGE_URL + '?' + `pageNum=${page}&` + `pageSize=${limit}&` + `name=${roleName}`)
    } else {
        console.log(1235);

        return request.get(API.GETROLEPAGE_URL + '?' + `pageNum=${page}&` + `pageSize=${limit}`)
    }
}

export const reqAddorUpdateRole = (role: any) => {
    if (role.id) {
        return request.put(API.ADDROLE_URL, role)
    } else {
        return request.post(API.ADDROLE_URL, role)
    }
}
// 获取角色菜单
export const reqGetRoLeMenu = (roleId: number) => { return request.get(API.GETMENULIST + roleId) }
//分配权限API
export const reqAssignAcl = (roleId: number, permissionId: number[]) => { return request.post(API.ASSIGNACL_URL + `${roleId}`, permissionId) }
export const reqRemoveRole = (roleId: number[]) => { return request.delete(API.DELETEROLE_URL + roleId) }
// 获取所有菜单
export const reqAllMenuList = () => { return request.get(API.GETALLMENU) }