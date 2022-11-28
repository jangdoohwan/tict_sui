import menuMockupData from './mock/menu.json'
import { isUseAPI } from '@/utils/check'
import requestApi from '@/api/ccp/requestApi'
export function getMenus() {
  if (isUseAPI()) {
    return new Promise(function(resolve, reject) {
      requestApi({
        url: '/online/com/menu/retrieveAuthMenu',
        headers: {
          'X-MID': 'P00001'
        },
        data: {},
        method: 'post',
        callback: res => {
          if (res.result.status === '200') {
            resolve(res.data)
          }
        }
      })
    })
  } else {
    return new Promise(function(resolve, reject) {
      resolve(menuMockupData)
    })
  }
}
