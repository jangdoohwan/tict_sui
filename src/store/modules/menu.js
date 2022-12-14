import { getMenus } from '@/api/common/menu'
import i18n from '@/i18n'
import store from '@/store'

var menuUtils = {
  setTreeMenu(menuData) {
    var tree = { children: [] }

    menuData.forEach(menuItem => {
      this.resolveTreeMenu(menuItem, tree, tree)
    })

    return tree.children
  },
  resolveTreeMenu(menuItem, targetMenuItem, tree) {
    if ((menuItem.menulevel | 0) === 1) {
      tree.children.push(menuItem)
      return
    }

    if (menuItem['prnt_menu_id'] === targetMenuItem['menu_id']) {
      if (!targetMenuItem.children) targetMenuItem.children = []
      targetMenuItem.children.push(menuItem)
      return
    }
    if (targetMenuItem.children) {
      targetMenuItem.children.forEach(newTargetMenuItem => {
        this.resolveTreeMenu(menuItem, newTargetMenuItem, tree)
      })
    }
  }
}

export default {
  state: {
    menus: [],
    progs: [],
    treeMenus: [],
    // 선택된 메뉴 정보, 1depth 메뉴가 선택 시, 변경을 위해 사용된다.
    selectedMenu: {
      menu_id: ''
    },
    flag: {
      asideVisiable: true,
      asideUse: true,
      tagViewUse: true,
      headerUse: true,
      footerUse: true
    },
    // D type 상단메뉴를 표시할 때 사용한다.
    topbarMenu: {
      showMenuCount: 5,
      startMenuIndex: 0,
      topbarVisible: false
    },
    // index 페이지 하드코딩
    firstHref: '/dashboard'
  },
  mutations: {
    SET_PROG: (state, progs) => {
      state.progs = progs
    },
    SET_MENU: (state, menus) => {
      state.menus = menus
    },
    SET_TREE_MENU: (state, treeMenus) => {
      state.treeMenus = treeMenus
    },
    SET_CURRENT_MENU: (state, selectedMenu) => {
      state.selectedMenu = selectedMenu
    },
    SET_ASIDE_MENU_USE: (state, flag) => {
      state.flag.asideUse = flag
    },
    SET_TAG_VIEW_USE: (state, flag) => {
      state.flag.tagViewUse = flag
    },
    SET_HEADER_USE: (state, flag) => {
      state.flag.headerUse = flag
    },
    SET_FOOTER_USE: (state, flag) => {
      state.flag.footerUse = flag
    },
    SET_SHOW_MENU_COUNT: (state, showMenuCount) => {
      state.topbarMenu.showMenuCount = showMenuCount
    },
    SET_START_MENU_INDEX: (state, startMenuIndex) => {
      state.topbarMenu.startMenuIndex = startMenuIndex
    },
    SET_TOPBAR_MENU_VISIBLE: (state, visible) => {
      state.topbarMenu.topbarVisible = visible
    },
    SET_FIRST_HREF: (state, href) => {
      state.firstHref = href
    }
  },
  actions: {
    GetMenus({ commit }) {
      return new Promise((resolve, reject) => {
        getMenus()
          .then(response => {
            store.dispatch('SetMenu', response)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    SetMenu({ commit }, menus) {
      commit('SET_MENU', menus)
      commit('SET_TREE_MENU', menuUtils.setTreeMenu(menus))
      // 가져온 메뉴 값을 가지고 i18n에 값을 셋팅한다.
      let ko = {}
      // let en = {}
      menus.forEach(menu => {
        ko[menu.menu_id] = menu.title
        // en[menu.menu_id] = menu.title_eng ? menu.title_eng : menu.menu_id
      })
      i18n.mergeLocaleMessage('ko', ko)
      // i18n.mergeLocaleMessage('en', en)
    },
    SetClearMenus({ commit }) {
      commit('SET_MENU', [])
    },
    SetFirstHref({ commit }, menus) {
      commit('SET_FIRST_HREF', menus)
    }
  }
}
