import { ActionInterface, Status } from './constants.js';
import { generateFile, getSponsors } from './template.js';
/**
 * Initializes and runs the action.
 * If no configuration is provided, the action will run with the default configuration.
 */
export default function run(configuration?: ActionInterface): Promise<Status>;
export { generateFile, getSponsors };
export type { ActionInterface };
