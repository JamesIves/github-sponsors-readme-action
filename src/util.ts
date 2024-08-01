import {ActionInterface, RequiredActionParameters} from './constants'
import {JSDOM} from 'jsdom'
import DOMPurify from 'dompurify'

/**
 * Defines the a new virtual DOM.
 */
const window = new JSDOM('').window

/**
 * Sanitizes the input.
 */
const {sanitize} = DOMPurify(window)

/**
 * Utility function that checks to see if a value is undefined or not.
 */
export const isNullOrUndefined = (value: string | undefined | null): boolean =>
  typeof value === 'undefined' || value === null || value === ''

/**
 * Checks for the required tokens and formatting. Throws an error if any case is matched.
 */
const hasRequiredParameters = <K extends keyof RequiredActionParameters>(
  action: ActionInterface,
  params: K[]
): boolean => {
  const nonNullParams = params.filter(
    param => !isNullOrUndefined(action[param])
  )
  return Boolean(nonNullParams.length)
}

/**
 * Verifies the action has the required parameters to run, otherwise throw an error.
 */
export const checkParameters = (action: ActionInterface): void => {
  if (!hasRequiredParameters(action, ['token'])) {
    throw new Error(
      'No deployment token was provided. You must provide the action with a Personal Access Token scoped to user:read and org:read.'
    )
  }
}

/**
 * Replaces all instances of a match in a string.
 */
export const replaceAll = (
  input: string,
  find: string,
  replace: string
): string => input.split(find).join(replace)

/**
 * Suppresses sensitive information from being exposed in error messages.
 */
export const suppressSensitiveInformation = (
  str: string,
  action: ActionInterface
): string => {
  let value = str

  const orderedByLength = (
    [action.token, action.token].filter(Boolean) as string[]
  ).sort((a, b) => b.length - a.length)

  for (const find of orderedByLength) {
    value = replaceAll(value, find, '***')
  }

  return value
}

/**
 * Extracts error message from an error.
 */
export const extractErrorMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : typeof error == 'string'
      ? error
      : JSON.stringify(error)

/**
 * Sanitizes and cleans an input.
 */
export const sanitizeAndClean = (input: string) => {
  const sanitizedInput = sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
  return sanitizedInput.replace(/[">}]/g, '')
}
