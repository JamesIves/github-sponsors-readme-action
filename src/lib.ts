import {info, setFailed, setOutput} from '@actions/core'
import {ActionInterface, Status} from './constants'
import {generateFile, getSponsors} from './template'
import {checkParameters, extractErrorMessage} from './util'

/** Initializes and runs the action.
 *
 * @param {ActionInterface} configuration - The configuration object.
 */
export default async function run(
  configuration: ActionInterface
): Promise<void> {
  let status: Status = Status.RUNNING

  const settings: ActionInterface = {
    ...configuration
  }

  try {
    info(`
    GitHub Sponsors Readme Action 💖

    🚀 Getting Started Guide: https://github.com/JamesIves/github-sponsors-readme-action
    ❓ Discussions / Q&A: https://github.com/JamesIves/github-sponsors-readme-action/discussions
    🔧 Report a Bug: https://github.com/JamesIves/github-sponsors-readme-action/issues

    📣 Maintained by James Ives: https://jamesiv.es
    💖 Support: https://github.com/sponsors/JamesIves`)

    info('Checking configuration and initializing… 🚚')
    checkParameters(settings)

    const response = await getSponsors(settings)
    console.log(response)
    status = await generateFile(response, settings)
  } catch (error) {
    status = Status.FAILED
    setFailed(extractErrorMessage(error))
  } finally {
    info(
      `${
        status === Status.FAILED
          ? 'There was an error generating sponsors. ❌'
          : status === Status.SUCCESS
          ? 'The data was succesfully retrieved and saved! ✅ 💖'
          : `Unable to locate markers in your file. Please check the documentation and try again. ⚠️`
      }`
    )

    setOutput('sponsorship-status', status)
  }
}

export {generateFile, getSponsors, ActionInterface}
