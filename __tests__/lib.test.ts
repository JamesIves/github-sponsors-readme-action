import {setFailed} from '@actions/core'
import {promises} from 'fs'
import {GitHubResponse, PrivacyLevel, Status} from '../src/constants'
import run from '../src/lib'

const response: GitHubResponse = {
  data: {
    viewer: {
      sponsorshipsAsMaintainer: {
        totalCount: 2,
        pageInfo: {
          endCursor: 'MQ'
        },
        nodes: [
          {
            createdAt: '123',
            privacyLevel: PrivacyLevel.PUBLIC,
            tier: {
              monthlyPriceInCents: 12000
            },
            sponsorEntity: {
              name: 'James Ives',
              login: 'JamesIves',
              url: 'https://github.com/JamesIves',
              websiteUrl: 'https://jamesiv.es',
              avatarUrl: 'https://avatars.githubusercontent.com/u/10888441?v=4'
            }
          },
          {
            createdAt: '123',
            privacyLevel: PrivacyLevel.PUBLIC,
            tier: {
              monthlyPriceInCents: 12000
            },
            sponsorEntity: {
              name: 'Montezuma Ives',
              login: 'MontezumaIves',
              url: 'https://github.com/MontezumaIves',
              websiteUrl: 'https://jamesiv.es',
              avatarUrl: 'https://avatars.githubusercontent.com/u/78580739?v=4'
            }
          }
        ]
      }
    }
  }
}

jest.mock('@actions/core', () => ({
  info: jest.fn(),
  setFailed: jest.fn(),
  getInput: jest.fn(),
  exportVariable: jest.fn(),
  setOutput: jest.fn()
}))

describe('lib', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(response)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should run through the commands and enter a success state', async () => {
    const action = {
      token: '123',
      file: './README.test.md',
      template:
        '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
      minimum: 0,
      maximum: 0,
      marker: 'sponsor',
      organization: false,
      fallback: '',
      activeOnly: true,
      includePrivate: false
    }

    await promises.writeFile(
      'README.test.md',
      'Generated README file for testing <!-- sponsor --><!-- sponsor --> - do not commit'
    )

    const res = await run(action)

    expect(res).toEqual(Status.SUCCESS)
  })

  it('should run through the commands and enter a skipped state', async () => {
    const action = {
      token: '123',
      file: '.github/TEST.md',
      template:
        '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
      minimum: 0,
      maximum: 0,
      marker: 'fake-marker',
      organization: false,
      fallback: '',
      activeOnly: true,
      includePrivate: false
    }

    // Purposely write incorrect data
    await promises.writeFile('SPONSORS.test.md', 'nothing here')

    const res = await run(action)

    expect(res).toEqual(Status.SKIPPED)
  })

  it('should throw an error if no token is provided', async () => {
    const action = {
      file: 'README.test.md',
      template:
        '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
      minimum: 0,
      maximum: 0,
      marker: 'sponsors',
      organization: false,
      fallback: '',
      activeOnly: true,
      includePrivate: false
    }

    try {
      await run(action)
    } catch (_error) {
      console.error(_error)

      expect(setFailed).toHaveBeenCalled()
    }
  })
})
