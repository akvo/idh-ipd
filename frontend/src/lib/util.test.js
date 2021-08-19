import { filterCountry, isAuthCookie } from "./util"

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

describe('filterCountry', () => {
  let init  = [
    {
      id: 1,
      name: "Country 1",
      company: [
        {
          id: 5,
          name: "Company 1",
        }
      ]
    }
  ]

  it('should return empty array if doesnt\'t have access', () => {
    expect(filterCountry([], init)).toEqual([])
  })

  it('should return Country 1 and 3', () => {
    const countries = [
      {
        id: 1,
        name: "Country 2",
        company: [
          {
            id: 6,
            name: "Company 2.1",
          },
          {
            id: 7,
            name: "Company 2.1",
          }
        ]
      },
      {
        id: 1,
        name: "Country 3",
        company: [
          {
            id: 8,
            name: "Company 3",
          }
        ]
      } 
    ]
    init = [
      ...init,
      ...countries
    ]
    const access = [{ company: 5 }, { company: 8 }]
    const findAccess = filterCountry(access, init).filter(item => ['Country 1', 'Country 3'].includes(item.name)).length
    expect(findAccess).toBe(2)
  })

})
