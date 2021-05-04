import { ActionInterface } from './constants';
export declare const isNullOrUndefined: (value: string | undefined | null) => boolean;
export declare const checkParameters: (action: ActionInterface) => void;
export declare const suppressSensitiveInformation: (str: string, action: ActionInterface) => string;
