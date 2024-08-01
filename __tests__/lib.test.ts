import {setFailed} from '@actions/core'
import nock from 'nock'
import {promises} from 'fs'
import {GitHubResponse, PrivacyLevel, Status, Urls} from '../src/constants'
import run from '../src/lib'
import '../src/main'

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
              websiteUrl: 'https://jamesiv.es'
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
              websiteUrl: 'https://jamesiv.es'
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
    nock(Urls.GITHUB_API).post('/graphql').reply(200, response)
  })

  afterEach(() => {
    nock.restore()
  })

  afterEach(nock.cleanAll)

  it('should run through the commands and enter a success state', async () => {
    const action = {
      token: '123',
      file: '.github/TEST.md',
      template:
        '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
      minimum: 0,
      maximum: 0,
      marker: 'sponsors',
      organization: false,
      fallback: '',
      activeOnly: true
    }

    // Valid file structure
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
      activeOnly: true
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
      activeOnly: true
    }

    try {
      await run(action)
    } catch (error) {
      expect(setFailed).toHaveBeenCalled()
    }
  })
})
