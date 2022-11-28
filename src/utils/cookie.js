import Cookies from 'js-cookie'

const TOKEN_KEY = 'TOKEN_KEY'
const CUST_ID = 'CUST_ID'
const USER_ID = 'USER_ID'
const USER_SEQ = 'USER_SEQ'
const USER_NAME = 'USER_NAME'
const LOCALE = 'LOCALE'
const CUST_SEQ = 'CUST_SEQ'

export function getCookie(key) {
  return Cookies.get(key)
}
export function setCookie(key, value) {
  Cookies.set(key, value)
}
export function removeCookie(key) {
  Cookies.remove(key)
}

export function getToken() {
  return getCookie(TOKEN_KEY)
}
export function setToken(token) {
  setCookie(TOKEN_KEY, token)
}
export function removeToken() {
  removeCookie(TOKEN_KEY)
}

export function getCustId() {
  return getCookie(CUST_ID)
}
export function setCustId(custId) {
  setCookie(CUST_ID, custId)
}
export function removeCustId() {
  removeCookie(CUST_ID)
}

export function getUserId() {
  return getCookie(USER_ID)
}
export function setUserId(userId) {
  setCookie(USER_ID, userId)
}
export function removeUserId() {
  removeCookie(USER_ID)
}

export function getUserName() {
  return getCookie(USER_NAME)
}
export function setUserName(userName) {
  setCookie(USER_NAME, userName)
}
export function removeUserName() {
  removeCookie(USER_NAME)
}

export function getUserSeq() {
  return getCookie(USER_SEQ)
}
export function setUserSeq(userSeq) {
  setCookie(USER_SEQ, userSeq)
}
export function removeUserSeq() {
  removeCookie(USER_SEQ)
}

export function getLocale() {
  return getCookie(LOCALE)
}
export function setLocale(lang) {
  setCookie(LOCALE, lang)
}
export function removeLocale() {
  removeCookie(LOCALE)
}

export function getCustSeq() {
  return getCookie(CUST_SEQ)
}
export function setCustSeq(custSeq) {
  setCookie(CUST_SEQ, custSeq)
}
export function removeCustSeq() {
  removeCookie(CUST_SEQ)
}
