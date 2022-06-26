import {getInput} from '@actions/core'
import {isNullOrUndefined} from './util'

export interface ActionInterface {
  /** Deployment token. */
  token?: string
  /** The template to use. */
  template: string
  /** The file to replace the content in. */
  file: string
  /** The minimum amount sponsored to be included. */
  minimum: number
  /** The maximum amount sponsored to be included. */
  maximum: number
  /** The marker at which the content should be included within. */
  marker: string
  /** If the user has no sponsors, we can replace it with a fallback. */
  fallback: string
  /** Fetches organization level sponsors if true. */
  organization: boolean
}

// Required action data that gets initialized when running within the GitHub Actions environment.
export const action = {
  token: getInput('token'),
  template: !isNullOrUndefined(getInput('template'))
    ? getInput('template')
    : `<a href="https://github.com/{{{ login }}}"><img src="https://github.com/{{{ login }}}.png" width="60px" alt="{{{ name }}}" /></a>`,
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
    : false
}

/** Describes the response from the GitHub GraphQL query. */
export interface Sponsor {
  sponsorEntity: {
    name: string | null
    login: string
    url: string
  }
  createdAt: string
  privacyLevel: PrivacyLevel
  tier: {
    monthlyPriceInCents: number
  }
}

export interface SponsorshipsAsMaintainer {
  totalCount: number
  pageInfo: {
    endCursor: string
  }
  nodes: Sponsor[]
}

export interface GitHubResponse {
  data: {
    viewer: {
      sponsorshipsAsMaintainer: SponsorshipsAsMaintainer
    }
  }
}

/** Types for the required action parameters. */
export type RequiredActionParameters = Pick<ActionInterface, 'token'>

export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

/** Status codes for the action. */
export enum Status {
  SUCCESS = 'success',
  FAILED = 'failed',
  RUNNING = 'running',
  SKIPPED = 'skipped'
}

export enum Urls {
  GITHUB_API = 'https://api.github.com'
}
