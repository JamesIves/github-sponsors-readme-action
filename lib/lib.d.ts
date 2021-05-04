import { ActionInterface } from './constants';
import { generateFile, getSponsors } from './template';
/** Initializes and runs the action.
 *
 * @param {ActionInterface} configuration - The configuration object.
 */
export default function run(configuration: ActionInterface): Promise<void>;
export { generateFile, getSponsors, ActionInterface };
