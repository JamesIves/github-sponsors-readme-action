export interface ActionInterface {
    /** Deployment token. */
    token?: string;
    /** The template to use. */
    template: string;
    /** The file to replace the content in. */
    file: string;
    /** The minimum amount sponsored to be included. */
    minimum: number;
    /** The maximum amount sponsored to be included. */
    maximum: number;
    /** The marker at which the content should be included within. */
    marker: string;
    /** If the user has no sponsors, we can replace it with a fallback. */
    fallback: string;
    /** Fetches organization level sponsors if true. */
    organization: boolean;
}
export declare const action: {
    token: string;
    template: string;
    minimum: number;
    maximum: number;
    marker: string;
    file: string;
    fallback: string;
    organization: boolean;
};
/** Describes the response from the GitHub GraphQL query. */
export interface Sponsor {
    sponsorEntity: {
        name: string | null;
        login: string;
        url: string;
    };
    createdAt: string;
    privacyLevel: PrivacyLevel;
    tier: {
        monthlyPriceInCents: number;
    };
}
export interface SponsorshipsAsMaintainer {
    totalCount: number;
    pageInfo: {
        endCursor: string;
    };
    nodes: Sponsor[];
}
export interface GitHubResponse {
    data: {
        viewer: {
            sponsorshipsAsMaintainer: SponsorshipsAsMaintainer;
        };
    };
}
/** Types for the required action parameters. */
export declare type RequiredActionParameters = Pick<ActionInterface, 'token'>;
export declare enum PrivacyLevel {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}
/** Status codes for the action. */
export declare enum Status {
    SUCCESS = "success",
    FAILED = "failed",
    RUNNING = "running",
    SKIPPED = "skipped"
}
export declare enum Urls {
    GITHUB_API = "https://api.github.com"
}
