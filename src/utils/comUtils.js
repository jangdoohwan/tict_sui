/**
 * 리스트 내 json string(object) 형식의 데이터 오브젝트를
 * 파싱하여 리스트 항목으로 세팅한다.
 * @param {*} list
 * @param {*} key
 * [{ dataObj: "{\"key\": \"value\"}" }]
 * -> [{ key: value }]
 */
export function getDataObjOfList(list, key, key2) {
  list.forEach((row) => {
    let dataObj = JSON.parse(row[key])
    if (key2) {
      dataObj = dataObj[key2]
    }
    Object.assign(row, dataObj)
  })
  return list
}

/**
 * 리스트 내 json string(array) 형식의 데이터 오브젝트를
 * 파싱하여 리스트 항목으로 세팅한다.
 * @param {*} list
 * @param {*} key
 * @param {*} itemKey
 * @param {*} itemValueKey
 */
export function getDataObjListOfList(list, key, itemKey, itemValueKey) {
  list.forEach((row) => {
    let dataArray = JSON.parse(row[key])
    let dataObj = {}
    dataArray.forEach((o) => {
      dataObj[o[itemKey]] = o[itemValueKey]
    })
    Object.assign(row, dataObj)
  })
  return list
}

/**
 * 특수문자 없는지 확인
 * @param {*} value
 */
export function checkKoEnNumber(value) {
  if (!value || value === '') {
    return false
  }
  return /^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(value)
}

/**
 * 영문 + 숫자 확인
 * @param {*} value
 */
export function checkEnNumber(value) {
  if (!value || value === '') {
    return false
  }
  return /^[a-zA-Z0-9_-]*$/.test(value)
}

/**
 * 한글 확인
 * @param {*} value
 */
export function checkOnlyKo(value) {
  if (!value || value === '') {
    return false
  }
  return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value)
}

/**
 * 전화번호 확인
 * @param {*} value
 */
export function checkTelNoWithoutDash(value) {
  if (!value || value === '') {
    return false
  }
  return /^[0-9]{9,11}$/.test(value)
}

/**
 * 숫자만 있는지 확인
 * @param {*} value
 */
export function checkOnlyNum(value) {
  if (!value || value === '') {
    return false
  }
  return /^[0-9]*$/.test(value)
}

/**
 * 이메일 형식 확인
 * @param {*} value
 */
export function checkEmail(value) {
  if (!value || value === '') {
    return false
  }
  return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,4}/i.test(
    value
  )
}

/**
 * 특수문자 확인
 * @param  {String} str 문자열
 * @return {Boolean} 특수문자 존재 여부
 */
export function checkSpecialCharacter(value) {
  const regCh = /[~!@#$%<>^&*()]/g
  if (regCh.test(value)) {
    return true
  }

  return false
}

/**
 * 빈값인지 확인
 * @param {*} value
 * @param {*} opt
 *    {
 *      allowZero: false
 *    }
 * @returns
 */
export function isEmpty(value, opt) {
  const defaultOptions = {
    allowZero: false
  }
  const options = Object.assign({}, defaultOptions, opt)

  if (value === undefined || value === null) {
    return true
  }
  if (typeof value === 'number') {
    if (!options.allowZero && (value === 0 || !value)) {
      return true
    }
  } else if (typeof value === 'string') {
    if (value === '' || value.length === 0) {
      return true
    }
  } else if (typeof value === 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true
      }
    } else if (!value) {
      return true
    } else {
      if (Object.keys(value).length === 0) {
        return true
      }
    }
  }
  return false
}
