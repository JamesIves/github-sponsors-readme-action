import {getInput} from '@actions/core'
import {isNullOrUndefined} from './util'

/**
 * Describes the action interface.
 */
export interface ActionInterface {
  /**
   * Deployment token.
   */
  token?: string
  /**
   * The template to use.
   */
  template: string
  /**
   * The file to replace the content in.
   */
  file: string
  /**
   * The minimum amount sponsored to be included.
   */
  minimum: number
  /**
   * The maximum amount sponsored to be included.
   */
  maximum: number
  /**
   * The marker at which the content should be included within.
   */
  marker: string
  /**
   * If the user has no sponsors, we can replace it with a fallback.
   */
  fallback: string
  /**
   * Fetches organization level sponsors if true.
   */
  organization: boolean
  /**
   * Determines if inactive sponsors should be returned or not.
   */
  activeOnly: boolean
  /**
   * Determines if private sponsors should be returned or not. If marked as true, the identity of the sponsor is still
   * kept private, however, an anonymized version of the sponsor is still included in the list.
   */
  includePrivate: boolean
}

/**
 * Gets the action configuration.
 */
export const action = {
  token: getInput('token'),
  template: !isNullOrUndefined(getInput('template'))
    ? getInput('template')
    : `<a href="https://github.com/{{ login }}"><img src="{{ avatarUrl }}" width="60px" alt="{{ name }}" /></a>`,
  minimum: !isNullOrUndefined(getInput('minimum'))
    ? parseInt(getInput('minimum'))
    : 0,
  maximum: !isNullOrUndefined(getInput('maximum'))
    ? parseInt(getInput('maximum'))
    : 0,
  marker: !isNullOrUndefined(getInput('marker'))
    ? getInput('marker')
    : 'sponsors',
  file: !isNullOrUndefined(getInput('file')) ? getInput('file') : 'README.md',
  fallback: !isNullOrUndefined(getInput('fallback'))
    ? getInput('fallback')
    : ``,
  organization: !isNullOrUndefined(getInput('organization'))
    ? getInput('organization').toLowerCase() === 'true'
    : false,
  activeOnly: !isNullOrUndefined(getInput('active-only'))
    ? getInput('active-only').toLowerCase() === 'true'
    : false,
  includePrivate: !isNullOrUndefined(getInput('include-private'))
    ? getInput('include-private').toLowerCase() === 'true'
    : false
}

/**
 * Describes the sponsor object.
 */
export interface Sponsor {
  sponsorEntity: {
    name: string | null
    login: string
    url: string
    avatarUrl: string
    websiteUrl: string | null
  }
  createdAt: string
  privacyLevel?: PrivacyLevel
  tier?: {
    monthlyPriceInCents?: number
  }
}

/**
 * Describes the response from the GitHub GraphQL query.
 */
export interface SponsorshipsAsMaintainer {
  totalCount: number
  pageInfo: {
    endCursor: string
  }
  nodes: Sponsor[]
}

/**
 * Describes the response from the GitHub GraphQL query.
 */
export interface GitHubResponse {
  data: {
    organization?: {
      sponsorshipsAsMaintainer: SponsorshipsAsMaintainer
    }
    viewer?: {
      sponsorshipsAsMaintainer: SponsorshipsAsMaintainer
    }
  }
}

/**
 * Describes the action interface.
 */
export type RequiredActionParameters = Pick<ActionInterface, 'token'>

/**
 * Privacy levels for the sponsorship.
 */
export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

/**
 * Statuses for the action.
 */
export enum Status {
  SUCCESS = 'success',
  FAILED = 'failed',
  RUNNING = 'running',
  SKIPPED = 'skipped'
}

/**
 * URLs used within the action.
 */
export enum Urls {
  GITHUB_API = 'https://api.github.com'
}
