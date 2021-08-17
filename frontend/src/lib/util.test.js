import { isAuthCookie } from "./util"

describe('isAuthCookie', () => {
  it('should return false if cookie doesn\'t exist', () => {
    expect(isAuthCookie()).toBe(false)
  })
  
  it('should return true if cookie is exist', () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: '_legacy_auth0.is.authenticated=true'
    })
    expect(isAuthCookie()).toBe(true)
  })
})
