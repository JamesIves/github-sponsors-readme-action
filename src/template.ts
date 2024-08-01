import 'cross-fetch/polyfill'
import {promises} from 'fs'
import {
  ActionInterface,
  GitHubResponse,
  PrivacyLevel,
  Sponsor,
  Status,
  Urls
} from './constants'
import {render} from 'mustache'
import {
  extractErrorMessage,
  suppressSensitiveInformation,
  sanitizeAndClean,
  replaceAll
} from './util'
import {info} from '@actions/core'

/**
 * Fetches sponsors from the GitHub Sponsors API.
 */
export async function getSponsors(
  action: ActionInterface
): Promise<GitHubResponse> {
  try {
    info(
      `Fetching data from the GitHub API as ${
        action.organization ? 'Organization' : 'User'
      }… ⚽`
    )

    const query = `query { 
      ${
        action.organization
          ? `organization (login: "${process.env.GITHUB_REPOSITORY_OWNER}")`
          : `viewer`
      } {
        login
        sponsorshipsAsMaintainer(first: 100, orderBy: {field: CREATED_AT, direction: ASC}, includePrivate: true, activeOnly: ${
          action.activeOnly
        }) {
          totalCount
          pageInfo {
            endCursor
          }
          nodes {
            sponsorEntity {
              ... on Organization {
                name
                login
                url
                websiteUrl
              }
              ... on User {
                name
                login
                url
                websiteUrl
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

    const data = await fetch(`${Urls.GITHUB_API}/graphql`, {
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
        extractErrorMessage(error),
        action
      )} ❌`
    )
  }
}

/**
 * Generates the sponsorship template.
 */
export function generateTemplate(
  response: GitHubResponse,
  action: ActionInterface
): string {
  let template = ``

  info('Generating template… ✨')

  const data = action.organization
    ? response.data.organization
    : response.data.viewer

  const sponsorshipsAsMaintainer = data?.sponsorshipsAsMaintainer

  if (sponsorshipsAsMaintainer) {
    /* Appends the template, the API call returns all users regardless of if they are hidden or not.
  In an effort to respect a users decision to be anonymous we filter these users out. */
    let filteredSponsors = sponsorshipsAsMaintainer.nodes.filter(
      (user: Sponsor) =>
        user.privacyLevel !== PrivacyLevel.PRIVATE &&
        (user.tier && user.tier.monthlyPriceInCents
          ? user.tier.monthlyPriceInCents
          : 0) >= action.minimum
    )

    if (action.maximum > 0) {
      filteredSponsors = filteredSponsors.filter(
        (user: Sponsor) =>
          (user.tier && user.tier.monthlyPriceInCents
            ? user.tier.monthlyPriceInCents
            : 0) <= action.maximum
      )
    }

    /** If there are no valid sponsors then we return the provided fallback. */
    if (!filteredSponsors.length) {
      return action.fallback
    }

    filteredSponsors.map(({sponsorEntity}) => {
      const sanitizedSponsorEntity = {
        websiteUrl: sanitizeAndClean(
          sponsorEntity.websiteUrl || sponsorEntity.url
        ),
        name: sanitizeAndClean(sponsorEntity.name || ''),
        login: sponsorEntity.login
      }

      const safeTemplate = replaceAll(
        replaceAll(action.template, '{{{', '{{'),
        '}}}',
        '}}'
      )

      template = template += render(safeTemplate, sanitizedSponsorEntity)
    })
  } else {
    info(`No sponsorship data was found… ❌`)
  }

  return template
}

/**
 * Generates the updated file with the attached sponsorship template.
 */
export async function generateFile(
  response: GitHubResponse,
  action: ActionInterface
): Promise<Status> {
  try {
    info(`Generating updated ${action.file} file… 📁`)

    /** Replaces the content within the comments and re appends/prepends the comments to the replace for follow-up workflow runs. */
    const regex = new RegExp(
      `(<!-- ${action.marker} -->)[\\s\\S]*?(<!-- ${action.marker} -->)`,
      'g'
    )
    let data = await promises.readFile(action.file, 'utf8')

    if (!regex.test(data)) {
      return Status.SKIPPED
    }

    data = data.replace(regex, `$1${generateTemplate(response, action)}$2`)

    await promises.writeFile(action.file, data)

    return Status.SUCCESS
  } catch (error) {
    throw new Error(
      `There was an error generating the updated file: ${suppressSensitiveInformation(
        extractErrorMessage(error),
        action
      )} ❌`
    )
  }
}
