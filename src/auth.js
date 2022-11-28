/**
 * page 별 권한 관리를 위한 로직 구성
 */
import router from './router'
import store from './store'
import envs from '@/envs'
import { getToken } from '@/utils/cookie'
import _ from 'lodash'

router.beforeEach(async (to, from, next) => {
  let token = getToken()
  // 토큰없고 로그인 이동 경우
  if (!token && to.path === '/login/loginPage') {
    next()
    return
  }

  // 토큰 없는 경우 로그인 이동
  if (!token && envs.framework.whiteList.indexOf(to.path) === -1) {
    next('/login')
    return
  }

  if (!store.state.menu.menus || store.state.menu.menus.length === 0) {
    // 메뉴 정보 없는 경우 메뉴 정보 조회
    await store.dispatch('GetMenus')
  }
  let menus = store.state.menu.menus
  let treeMenus = store.state.menu.treeMenus
  // 첫번째 메뉴 이동
  if (to.path === '/login/loginPage' || to.path === '/home') {
    let first = getValidMenuUrl(treeMenus)
    next(first)
    return
  }

  let menu = _.find(menus, {
    href: to.path
  })
  // 이동할 메뉴가 권한이 있는지
  if (
    menu ||
    envs.framework.whiteListWithLogin.indexOf(to.path) > -1 ||
    envs.framework.whiteList.indexOf(to.path) > -1
  ) {
    next()
  } else {
    next('/404')
  }
})

function getValidMenuUrl(menus) {
  let returnUrl = ''
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].href) {
      returnUrl = menus[i].href
      break
    } else if (menus[i].children && menus[i].children.length) {
      returnUrl = getValidMenuUrl(menus[i].children)
      if (returnUrl) {
        break
      }
    }
  }
  return returnUrl
}
