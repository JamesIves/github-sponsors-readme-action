import {info, setFailed, setOutput} from '@actions/core'
import {ActionInterface, Status} from './constants'
import {generateFile, getSponsors} from './template'
import {checkParameters} from './util'

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

    🚀 Getting Started Guide:
    ❓ Discussions / Q&A: https://github.com/JamesIves/github-sponsors-readme-action/discussions
    🔧 Report a Bug: https://github.com/JamesIves/github-sponsors-readme-action/issues

    📣 Maintained by James Ives: https://jamesiv.es
    💖 Support: https://github.com/sponsors/JamesIves`)

    info('Checking configuration and initializing… 🚚')
    checkParameters(settings)

    const response = await getSponsors(settings)
    await generateFile(response, settings)
  } catch (error) {
    status = Status.FAILED
    setFailed(error.message)
  } finally {
    info(
      `${
        status === Status.FAILED
          ? 'There was an error generating sponsors. ❌'
          : 'The data was succesfully retrieved and saved! ✅ 💖'
      }`
    )

    setOutput('sponsorship-status', status)
  }
}
