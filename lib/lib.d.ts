import { ActionInterface, Status } from './constants';
import { generateFile, getSponsors } from './template';
/**
 * Initializes and runs the action.
 * If no configuration is provided, the action will run with the default configuration.
 */
export default function run(configuration?: ActionInterface): Promise<Status>;
export { generateFile, getSponsors, ActionInterface };
