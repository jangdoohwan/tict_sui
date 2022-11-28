<template>
  <div>
    <div class="gnb">
      <div class="menu-group">
        <ul class="gnb-nav">
          <li
            v-for="menu in treeMenus"
            :key="menu.menu_id"
            class="gnb-nav-item"
            :class="{ plus: hasChildren(menu) }"
            @mouseleave="activeMenu.depth1 = ''"
          >
            <a
              href="javascript:void(0)"
              :class="{ active: activeMenu.depth1 === menu.menu_id }"
              @click="setActiveMenu(menu, 'depth1')"
            >
              <span
                class="gnb-nav-title"
                :class="{ external: menu.progGubun === 'O' }"
              >
                {{ menu.title }}
              </span>
            </a>
            <!-- 2depth menu -->
            <ul
              v-if="hasChildren(menu)"
              class="gnb-nav-sub"
              :class="{
                active: activeMenu.depth1 === menu.menu_id
              }"
            >
              <li
                v-for="depth2Menu in menu.children"
                :key="depth2Menu.menu_id"
                class="gnb-nav-sub-item"
                :class="{
                  plus: hasChildren(depth2Menu),
                  external: depth2Menu.progGubun === 'O'
                }"
              >
                <a
                  href="javascript:void(0)"
                  @click="setActiveMenu(depth2Menu, 'depth2')"
                >
                  <span>{{ depth2Menu.title }}</span>
                </a>
                <!-- 3depth menu -->
                <ul
                  v-if="hasChildren(depth2Menu)"
                  class="gnb-nav-sub2"
                  :class="{ active: depth2Menu.menu_id === activeMenu.depth2 }"
                >
                  <li
                    v-for="dept3Menu in depth2Menu.children"
                    :key="dept3Menu.menu_id"
                    class="gnb-nav-sub2-item"
                    :class="{ external: dept3Menu.progGubun === 'O' }"
                  >
                    <a href="javascript:void(0)" @click="goMenu(dept3Menu)">
                      <span>{{ dept3Menu.title }}</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'LayoutMenu',
  data() {
    return {
      pageIndex: 0,
      activeMenu: {
        depth1: '',
        depth2: ''
      }
    }
  },
  computed: {
    treeMenus() {
      return store.state.menu.treeMenus
    }
  },
  methods: {
    hasChildren(menuObj) {
      return menuObj && menuObj.children && menuObj.children.length > 0
    },
    setActiveMenu(menu, depth) {
      if (!this.hasChildren(menu)) {
        this.goMenu(menu)
      } else {
        this.activeMenu[depth] =
          this.activeMenu[depth] === menu.menu_id ? '' : menu.menu_id
      }
    },
    getValidMenuUrl(parentMenu) {
      let returnUrl = ''
      let menus = null
      if (parentMenu.children && parentMenu.children.length) {
        menus = parentMenu.children
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].href) {
            returnUrl = menus[i].href
            break
          } else if (menus[i].children && menus[i].children.length) {
            returnUrl = this.getValidMenuUrl(menus[i])
            if (returnUrl) {
              break
            }
          }
        }
      }
      return returnUrl
    },
    goMenu(menu) {
      if (menu.progGubun === 'O') {
        // 외부 - 새 창으로 띄움
        if (menu.href.startsWith('/')) {
          let route = this.$router.resolve({ path: menu.href })
          window.open(route.href)
        } else {
          window.open(menu.href)
        }
      } else {
        // 내부
        if (menu.href.startsWith('/')) {
          let url = menu.href
          if (this.$route.path === url) {
            url = url + '?' + this.pageIndex++
          }
          this.$router.push(url)
        } else {
          const router = {
            name: 'IframePage',
            params: {
              url: menu.href
            }
          }
          this.$router.push(router)
        }
      }
    }
  }
}
</script>

<style lang="less"></style>
