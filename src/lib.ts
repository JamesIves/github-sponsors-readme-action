import {info, setFailed} from '@actions/core'
import {action, ActionInterface} from './constants'
import {retrieveData} from './fetch'

/** Initializes and runs the action.
 *
 * @param {ActionInterface} configuration - The configuration object.
 */
export default async function run(
  configuration: ActionInterface
): Promise<void> {
  let errorState = false

  const settings = {
    ...action,
    ...configuration
  }

  try {
    info(`
    Sponsorship Action TODO: 📦 🚚
    
    📣 Maintained by James Ives (https://jamesiv.es)`)

    info('Checking configuration and initializing… 🚚')

    const data = await retrieveData()

    console.log(settings, data)
  } catch (error) {
    errorState = true
    setFailed(error.message)
  } finally {
    info(
      `${
        errorState
          ? 'There was an error fetching the data. ❌'
          : 'The data was succesfully retrieved and saved! ✅ 🚚'
      }`
    )
  }
}
