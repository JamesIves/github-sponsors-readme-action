import {getInput} from '@actions/core'
import {isNullOrUndefined} from './util'

export interface ActionInterface {
  /** Deployment token. */
  token: string | null
  /** The template to use. */
  template: string
  /** The file to replace the content in. */
  file: string
  /** The minimum amount sponsored to be included. */
  sponsorshipThreshold: number
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
    : `<a href="https://github.com/{{{ login }}}"><img src="https://github.com/{{{ login }}}.png" width="60px" alt="" /></a>`,
  sponsorshipThreshold: !isNullOrUndefined(getInput('sponsorship-threshold'))
    ? parseInt(getInput('sponsorship-threshold'))
    : 0,
  marker: !isNullOrUndefined(getInput('marker'))
    ? getInput('marker')
    : 'sponsors',
  file: getInput('file'),
  fallback: !isNullOrUndefined(getInput('fallback')) ? getInput('fallback') : ``,
  organization: !isNullOrUndefined(getInput('organization'))
  ? getInput('organization').toLowerCase() === 'true'
  : false,
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
export type RequiredActionParameters = Pick<
  ActionInterface,
  'token' | 'file' | 'marker'
>

export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

/** Status codes for the action. */
export enum Status {
  SUCCESS = 'success',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  RUNNING = 'running'
}
