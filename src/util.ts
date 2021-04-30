import {ActionInterface, RequiredActionParameters} from './constants'

/* Utility function that checks to see if a value is undefined or not. */
export const isNullOrUndefined = (value: string | undefined | null): boolean =>
  typeof value === 'undefined' || value === null || value === ''

/* Checks for the required tokens and formatting. Throws an error if any case is matched. */
const hasRequiredParameters = <K extends keyof RequiredActionParameters>(
  action: ActionInterface,
  params: K[]
): boolean => {
  const nonNullParams = params.filter(
    param => !isNullOrUndefined(action[param])
  )
  return Boolean(nonNullParams.length)
}

/* Verifies the action has the required parameters to run, otherwise throw an error. */
export const checkParameters = (action: ActionInterface): void => {
  if (!hasRequiredParameters(action, ['token'])) {
    throw new Error(
      'No deployment token was provided. You must provide the action with a Personal Access Token scoped to user:read.'
    )
  }

  if (!hasRequiredParameters(action, ['file'])) {
    throw new Error('File is required.')
  }

  if (!hasRequiredParameters(action, ['marker'])) {
    throw new Error('Marker is required.')
  }
}

/* Replaces all instances of a match in a string. */
const replaceAll = (input: string, find: string, replace: string): string =>
  input.split(find).join(replace)

/* Suppresses sensitive information from being exposed in error messages. */
export const suppressSensitiveInformation = (
  str: string,
  action: ActionInterface
): string => {
  let value = str

  const orderedByLength = ([action.token].filter(Boolean) as string[]).sort(
    (a, b) => b.length - a.length
  )

  for (const find of orderedByLength) {
    value = replaceAll(value, find, '***')
  }

  return value
}
