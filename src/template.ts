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
        sponsorshipsAsMaintainer(first: 100, orderBy: {field: CREATED_AT, direction: ASC}, includePrivate: ${action.includePrivate}, activeOnly: ${
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
                avatarUrl
              }
              ... on User {
                name
                login
                url
                websiteUrl
                avatarUrl
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
    let filteredSponsors = sponsorshipsAsMaintainer.nodes.filter(
      (user: Sponsor) =>
        (user.tier && user.tier.monthlyPriceInCents
          ? user.tier.monthlyPriceInCents
          : 0) >= action.minimum
    )

    /**
     * If `includePrivate` is true here, we replace the private sponsors with a placeholder asset and anonymize all data to respect privacy.
     */
    if (action.includePrivate) {
      filteredSponsors = filteredSponsors.map((user: Sponsor) => {
        if (user.privacyLevel === PrivacyLevel.PRIVATE) {
          return {
            ...user,
            sponsorEntity: {
              name: 'Private Sponsor',
              login: '',
              url: 'https://github.com',
              websiteUrl: 'https://github.com',
              avatarUrl:
                'https://raw.githubusercontent.com/JamesIves/github-sponsors-readme-action/dev/.github/assets/placeholder.png'
            }
          }
        }
        return user
      })
    } else {
      /**
       * If `includePrivate` is false we filter out any priv1ate sponsors. This is a safeguard incase the GitHub API
       * decides to return private sponsors for some reason.
       */
      filteredSponsors = filteredSponsors.filter(
        (user: Sponsor) => user.privacyLevel !== PrivacyLevel.PRIVATE
      )
    }

    if (action.maximum > 0) {
      filteredSponsors = filteredSponsors.filter(
        (user: Sponsor) =>
          (user.tier && user.tier.monthlyPriceInCents
            ? user.tier.monthlyPriceInCents
            : 0) <= action.maximum
      )
    }

    info(
      `Found ${filteredSponsors.length} matching sponsors… ${filteredSponsors.length > 0 ? '🎉' : '😢'}`
    )

    /**
     * If there are no valid sponsors then we return the provided fallback.
     */
    if (!filteredSponsors.length) {
      return action.fallback
    }

    filteredSponsors.map(({sponsorEntity}) => {
      /**
       * Sanitizes and cleans the sponsor data individually.
       */
      const sanitizedSponsorEntity = {
        websiteUrl: sanitizeAndClean(
          sponsorEntity.websiteUrl || sponsorEntity.url
        ),
        name: sanitizeAndClean(sponsorEntity.name || ''),
        login: sanitizeAndClean(sponsorEntity.login),
        avatarUrl: sponsorEntity.avatarUrl
      }

      /**
       * Ensure that the template is safe to render by preventing the usage of triple brackets.
       */
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
