/**
 * Describes the action interface.
 */
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
    /** Determines if inactive sponsors should be returned or not. */
    activeOnly: boolean;
    /** Determines if private sponsors should be returned or not. If marked as true, the identity of the sponsor is still
      kept private, however, an anonymized version of the sponsor is still included in the list. */
    includePrivate: boolean;
}
/**
 * Gets the action configuration.
 */
export declare const action: {
    token: string;
    template: string;
    minimum: number;
    maximum: number;
    marker: string;
    file: string;
    fallback: string;
    organization: boolean;
    activeOnly: boolean;
    includePrivate: boolean;
};
/**
 * Describes the sponsor object.
 */
export interface Sponsor {
    sponsorEntity: {
        name: string | null;
        login: string;
        url: string;
        avatarUrl: string;
        websiteUrl: string | null;
    };
    createdAt: string;
    privacyLevel?: PrivacyLevel;
    tier?: {
        monthlyPriceInCents?: number;
    };
}
/**
 * Describes the response from the GitHub GraphQL query.
 */
export interface SponsorshipsAsMaintainer {
    totalCount: number;
    pageInfo: {
        endCursor: string;
    };
    nodes: Sponsor[];
}
/**
 * Describes the response from the GitHub GraphQL query.
 */
export interface GitHubResponse {
    data: {
        organization?: {
            sponsorshipsAsMaintainer: SponsorshipsAsMaintainer;
        };
        viewer?: {
            sponsorshipsAsMaintainer: SponsorshipsAsMaintainer;
        };
    };
}
/**
 * Describes the action interface.
 */
export type RequiredActionParameters = Pick<ActionInterface, 'token'>;
/**
 * Privacy levels for the sponsorship.
 */
export declare enum PrivacyLevel {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}
/**
 * Statuses for the action.
 */
export declare enum Status {
    SUCCESS = "success",
    FAILED = "failed",
    RUNNING = "running",
    SKIPPED = "skipped"
}
/**
 * URLs used within the action.
 */
export declare enum Urls {
    GITHUB_API = "https://api.github.com"
}
