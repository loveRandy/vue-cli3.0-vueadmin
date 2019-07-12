import { fetchPermission } from '@/api/permission'
import router, { DynamicRoutes } from '@/router/index'
import { recursionRouter } from '@/utils/recursion-router'
import dynamicRouter from '@/router/dynamic-router'

export default {
    namespaced: true,
    state: {
        permissionList: null /** 所有路由 */,
        sidebarMenu: [] /** 导航菜单 */,
        currentMenu: '' /** 当前active导航菜单 */,
        control_list: [] /** 完整的权限列表 */,
        avatar: ''/** 头像 */,
        account: ''/** 用户角色 */
    },
    getters: {},
    mutations: {
        SET_AVATAR(state, avatar) {
            state.avatar = avatar
        },
        SET_ACCOUNT(state, account) {
            state.account = account
        },
        SET_PERMISSION(state, routes) {
            state.permissionList = routes
        },
        CLEAR_PERMISSION(state) {
            state.permissionList = null
        },
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
        CLEAR_MENU(state) {
            state.sidebarMenu = []
        },
        SET_CURRENT_MENU(state, currentMenu) {
            state.currentMenu = currentMenu
        },
        SET_CONTROL_LIST(state, list) {
            state.control_list = list
        }
    },
    actions: {
        async FETCH_PERMISSION({ commit, state }) {
            let permissionList = await fetchPermission()
            commit('SET_AVATAR', permissionList.avatar)
            commit('SET_ACCOUNT', permissionList.name)
            let routes = recursionRouter(permissionList.data, dynamicRouter)
            let MainContainer = DynamicRoutes.find(v => v.path === '')
            let children = MainContainer.children
            commit('SET_CONTROL_LIST', [...children, ...dynamicRouter])
            children.push(...routes)
            commit('SET_MENU', children)
            let initialRoutes = router.options.routes
            router.addRoutes(DynamicRoutes)
            commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        }
    }
}
