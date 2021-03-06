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
    GitHub Sponsors Readme Action π

    π Getting Started Guide: https://github.com/JamesIves/github-sponsors-readme-action
    β Discussions / Q&A: https://github.com/JamesIves/github-sponsors-readme-action/discussions
    π§ Report a Bug: https://github.com/JamesIves/github-sponsors-readme-action/issues

    π£ Maintained by James Ives: https://jamesiv.es
    π Support: https://github.com/sponsors/JamesIves`)

    info('Checking configuration and initializingβ¦ π')
    checkParameters(settings)

    const response = await getSponsors(settings)
    status = await generateFile(response, settings)
  } catch (error) {
    status = Status.FAILED
    setFailed(extractErrorMessage(error))
  } finally {
    info(
      `${
        status === Status.FAILED
          ? 'There was an error generating sponsors. β'
          : status === Status.SUCCESS
          ? 'The data was succesfully retrieved and saved! β π'
          : `Unable to locate markers in your file. Please check the documentation and try again. β οΈ`
      }`
    )

    setOutput('sponsorship-status', status)
  }
}

export {generateFile, getSponsors, ActionInterface}
