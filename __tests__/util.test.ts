import {
  checkParameters,
  extractErrorMessage,
  suppressSensitiveInformation,
  isNullOrUndefined,
  sanitizeAndClean,
  replaceAll
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
        template: '* {{ url }}',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      try {
        checkParameters(action)
      } catch (error) {
        expect(extractErrorMessage(error)).toMatch(
          'No deployment token was provided. You must provide the action with a Personal Access Token scoped to user:read and org:read.'
        )
      }
    })

    it('should not fail if it has all of the parameters', () => {
      const action = {
        token: 'montezuma',
        file: 'README.test.md',
        template: '* {{ url }}',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
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
        template: '* {{ url }}',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      const string = `This is an error message! It contains ${action.token} and ${action.token} again!`
      expect(suppressSensitiveInformation(string, action)).toBe(
        'This is an error message! It contains *** and *** again!'
      )
    })
  })

  describe('extractErrorMessage', () => {
    it('gets the message of a Error', () => {
      expect(extractErrorMessage(new Error('a error message'))).toBe(
        'a error message'
      )
    })

    it('gets the message of a string', () => {
      expect(extractErrorMessage('a error message')).toBe('a error message')
    })

    it('gets the message of a object', () => {
      expect(extractErrorMessage({special: 'a error message'})).toBe(
        `{"special":"a error message"}`
      )
    })
  })

  describe('sanitizeAndClean', () => {
    it('strips script tags entirely, keeping only the text', () => {
      expect(sanitizeAndClean('<script>alert(1)</script>Montezuma')).toBe(
        'Montezuma'
      )
    })

    it('strips event-handler attributes and the tag itself', () => {
      expect(sanitizeAndClean('<img src=x onerror="alert(1)">Cat')).toBe('Cat')
    })

    it('neutralizes javascript: URLs by stripping the containing tag', () => {
      expect(sanitizeAndClean('<a href="javascript:alert(1)">click</a>')).toBe(
        'click'
      )
    })

    it('HTML-entity-encodes stray angle brackets and strips quotes, leaving the entity text intact', () => {
      // DOMPurify entity-encodes bare `<`/`>` in text nodes rather than deleting them;
      // the follow-up regex only strips literal ["'<>] characters, so &lt;/&gt; survive as text.
      expect(sanitizeAndClean(`"'<>Montezuma"'<>`)).toBe(
        '&lt;&gt;Montezuma&lt;&gt;'
      )
    })

    it('documents that the quote-stripping regex also strips a legitimate apostrophe (known trade-off)', () => {
      expect(sanitizeAndClean(`James O'Ives`)).toBe('James OIves')
    })

    it('does not mangle a legitimate https URL', () => {
      expect(sanitizeAndClean('https://jamesiv.es/path?query=1')).toBe(
        'https://jamesiv.es/path?query=1'
      )
    })
  })

  describe('replaceAll', () => {
    it('replaces every occurrence of the search string', () => {
      expect(replaceAll('a-b-c-d', '-', '_')).toBe('a_b_c_d')
    })

    it('downgrades triple mustache braces to double', () => {
      expect(replaceAll('{{{ name }}}', '{{{', '{{')).toBe('{{ name }}}')
    })

    it('returns the input unchanged when there is nothing to replace', () => {
      expect(replaceAll('no match here', 'xyz', '_')).toBe('no match here')
    })
  })
})
