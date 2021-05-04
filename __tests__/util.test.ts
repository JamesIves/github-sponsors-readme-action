import {
  checkParameters,
  suppressSensitiveInformation,
  isNullOrUndefined
} from '../src/util'

describe('util', () => {
  describe('isNullOrUndefined', () => {
    it('should return true if the value is null', async () => {
      const value = null
      expect(isNullOrUndefined(value)).toBeTruthy()
    })

    it('should return true if the value is undefined', async () => {
      const value = undefined
      expect(isNullOrUndefined(value)).toBeTruthy()
    })

    it('should return false if the value is defined', async () => {
      const value = 'montezuma'
      expect(isNullOrUndefined(value)).toBeFalsy()
    })

    it('should return false if the value is empty string', async () => {
      const value = ''
      expect(isNullOrUndefined(value)).toBeTruthy()
    })
  })

  describe('hasRequiredParameters', () => {
    it('should fail if there is no provided Access Token', () => {
      const action = {
        file: 'README.test.md',
        template: '* {{{ url }}}',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: ''
      }

      try {
        checkParameters(action)
      } catch (e) {
        expect(e.message).toMatch(
          'No deployment token was provided. You must provide the action with a Personal Access Token scoped to user:read or org:read.'
        )
      }
    })

    it('should not fail if it has all of the parameters', () => {
      const action = {
        token: 'montezuma',
        file: 'README.test.md',
        template: '* {{{ url }}}',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: ''
      }

      const response = checkParameters(action)
      expect(response).toBe(undefined)
    })
  })

  describe('suppressSensitiveInformation', () => {
    it('should replace any sensitive information with ***', async () => {
      const action = {
        token: 'insanelyimportanttokendonotsteal',
        file: 'README.test.md',
        template: '* {{{ url }}}',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: ''
      }

      const string = `This is an error message! It contains ${action.token} and ${action.token} again!`
      expect(suppressSensitiveInformation(string, action)).toBe(
        'This is an error message! It contains *** and *** again!'
      )
    })
  })
})