import 'cross-fetch/polyfill'
import {promises} from 'fs'
import {
  ActionInterface,
  GitHubResponse,
  PrivacyLevel,
  Sponsor,
  SponsorshipsAsMaintainer
} from './constants'
import {render} from 'mustache'
import {suppressSensitiveInformation} from './util'
import {info} from '@actions/core'

export async function getSponsors(
  action: ActionInterface
): Promise<GitHubResponse> {
  try {
    info('Fetching data from the GitHub API… 🚚')

    const query = `query { 
      viewer {
        login
        sponsorshipsAsMaintainer(first: 100, orderBy: {field: CREATED_AT, direction: ASC}, includePrivate: true) {
          totalCount
          pageInfo {
            endCursor
          }
          nodes {
            sponsorEntity {
              ... on User {
                name
                login
                url
              }
            }
            createdAt
            privacyLevel
            tier {
              monthlyPriceInCents
            }
          }
        }
      }
    }`

    const data = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${action.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query
      })
    })

    return data.json()
  } catch (error) {
    throw new Error(
      `There was an error with the GitHub API request: ${suppressSensitiveInformation(
        error.message,
        action
      )} ❌`
    )
  }
}

export function generateTemplate(
  response: GitHubResponse,
  action: ActionInterface
): string {
  let template = ``

  info('Generating template… 🚚')

  const {
    sponsorshipsAsMaintainer
  }: {sponsorshipsAsMaintainer: SponsorshipsAsMaintainer} = response.data.viewer

  /* Appends the template, the API call returns all users regardless of if they are hidden or not.
  In an effort to respect a users decisison to be anoymous we filter these users out. */
  sponsorshipsAsMaintainer.nodes
    .filter(
      (user: Sponsor) =>
        user.privacyLevel !== PrivacyLevel.PRIVATE &&
        user.tier.monthlyPriceInCents >= action.sponsorshipThreshold
    )
    .map(({sponsorEntity}) => {
      template = template += render(action.template, sponsorEntity)
    })

  return template
}

export async function generateFile(
  response: GitHubResponse,
  action: ActionInterface
): Promise<void> {
  try {
    info(`Generating updated ${action.file}… 🚚`)

    const regex = new RegExp(
      `(<!-- ${action.marker} -->)[\s\\\S]*?(<!-- ${action.marker} -->)`,
      'g'
    )
    let data = await promises.readFile(action.file, 'utf8')

    data = data.replace(regex, `$1${generateTemplate(response, action)}$2`)

    await promises.writeFile(action.file, data)
  } catch (error) {
    throw new Error(
      `There was an error generating the updated file: ${suppressSensitiveInformation(
        error.message,
        action
      )} ❌`
    )
  }
}
