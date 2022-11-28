import requestApi from '@/api/ccp/requestApi'

export function getApiParamData(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/com/api/getIotApiParam',
      headers: {
        'X-MID': data.xMid
      },
      method: 'post',
      data: { apiSeq: data.apiSeq },
      callback: (res) => {
        if (res.result.status === '200' || res.result.status === '204') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

export function executeApi(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: data.url,
      headers: data.headers,
      method: 'post',
      data: data.body,
      callback: (res) => {
        if (res.result.status === '200' || res.result.status === '204') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

export function executeQuery(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/com/usrDash/executeQuery',
      headers: { 'X-MID': 'P02001' },
      method: 'post',
      data: data,
      callback: (res) => {
        if (res.result.status === '200' || res.result.status === '204') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

export function executePolling(data) {
  return new Promise((resolve, reject) => {
    requestApi(
      {
        url: '/online/iotPushTopic/polling',
        headers: Object.assign(
          {},
          {
            'X-MID': 'P02001'
          },
          data.headers
        ),
        method: 'post',
        data: data.body,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            resolve(res.data)
          } else {
            reject(res)
          }
        }
      },
      {
        useLoading: false
      }
    )
  })
}
