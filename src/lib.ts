import {
  info,
  setFailed,
  exportVariable,
  setOutput as setEnvironmentOutput
} from '@actions/core'
import {action, ActionInterface, Status} from './constants.js'
import {generateFile, getSponsors} from './template.js'
import {checkParameters, extractErrorMessage} from './util.js'

/**
 * Initializes and runs the action.
 * If no configuration is provided, the action will run with the default configuration.
 */
export default async function run(
  configuration?: ActionInterface
): Promise<Status> {
  let status: Status = Status.FAILED

  /**
   * Merges the action configuration with the user configuration.
   */
  const settings: ActionInterface = {
    ...action,
    ...configuration
  }

  try {
    info(`

     ██████╗ ██╗████████╗██╗  ██╗██╗   ██╗██████╗                       
    ██╔════╝ ██║╚══██╔══╝██║  ██║██║   ██║██╔══██╗                      
    ██║  ███╗██║   ██║   ███████║██║   ██║██████╔╝                      
    ██║   ██║██║   ██║   ██╔══██║██║   ██║██╔══██╗                      
    ╚██████╔╝██║   ██║   ██║  ██║╚██████╔╝██████╔╝                      
     ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝                       
                                                                        
    ███████╗██████╗  ██████╗ ███╗   ██╗███████╗ ██████╗ ██████╗ ███████╗
    ██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔═══██╗██╔══██╗██╔════╝
    ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝███████╗
    ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗╚════██║
    ███████║██║     ╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║███████║
    ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                                                        
    ██████╗ ███████╗ █████╗ ██████╗ ███╗   ███╗███████╗                 
    ██╔══██╗██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝                 
    ██████╔╝█████╗  ███████║██║  ██║██╔████╔██║█████╗                   
    ██╔══██╗██╔══╝  ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝                   
    ██║  ██║███████╗██║  ██║██████╔╝██║ ╚═╝ ██║███████╗                 
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝                 
                                                                        
     █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗                     
    ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║                     
    ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║                     
    ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║                     
    ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║                     
    ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝                     
                                                                        
    🚀 Getting Started Guide: https://github.com/JamesIves/github-sponsors-readme-action
    ❓ Discussions / Q&A: https://github.com/JamesIves/github-sponsors-readme-action/discussions
    🔧 Report a Bug: https://github.com/JamesIves/github-sponsors-readme-action/issues

    📣 Maintained by James Ives: https://jamesiv.es
    💖 Support: https://github.com/sponsors/JamesIves`)

    info('Checking configuration and initializing… 🚚')
    checkParameters(settings)

    const response = await getSponsors(settings)
    status = await generateFile(response, settings)
  } catch (error) {
    setFailed(extractErrorMessage(error))
  } finally {
    info(
      `${
        status === Status.FAILED
          ? 'There was an error generating sponsors. ❌'
          : status === Status.SUCCESS
            ? 'The data was successfully retrieved and saved! ✅ 💖'
            : `Unable to locate markers in your file, ensure you have a starting and closing tag in your README file. Please check the documentation and try again. ⚠️`
      }`
    )

    exportVariable('sponsorshipStatus', status)
    setEnvironmentOutput('sponsorshipStatus', status)
  }

  return status
}

export {generateFile, getSponsors, ActionInterface}
