import request from '@/util/request.ts'
enum API {
    PAGEUSER_URL = '/user/page',
    ADDUSER_URL = '/user',
    ASSIGNROLE_URL = '/admin/acl/user/toAssign/',
    TAKEROLE_URL = '/admin/acl/user/doAssignRole',
    DELETEUSERBYID_URL = '/admin/acl/user/remove/',
    DELETEUSERLIST_URL = '/admin/acl/user/batchRemove'
}

export const reqUserList = (page: number, limit: number, username) => {
    if (username) {
        return request.get(API.PAGEUSER_URL + '?' + 'pageNum=' + page + '&' + `pageSize=${limit}&username=${username}`)
    } else {
        return request.get(API.PAGEUSER_URL + '?' + 'pageNum=' + page + '&' + `pageSize=${limit}`)
    }

}
export const reqAddOrUpdateUser = (user) => {
    if (user.id) {
        return request.put(API.ADDUSER_URL, user)
    }
    else {
        return request.post(API.ADDUSER_URL, user)
    }

}

//根据用户的id删除单个用户
export const reqDelUserById = (userId: number) => {
    return request.delete(API.ADDUSER_URL + '/' + userId)
}
//根据传入的id列表批量删除用户
export const reqDelUserByList = (userList: any) => {
    return request.delete(API.ADDUSER_URL + '/' + userList)
}