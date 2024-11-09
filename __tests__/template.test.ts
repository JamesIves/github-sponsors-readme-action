import {info} from '@actions/core'
import {promises} from 'fs'
import {GitHubResponse, PrivacyLevel, Status} from '../src/constants'
import {generateFile, generateTemplate, getSponsors} from '../src/template'

jest.setTimeout(60000)

jest.mock('@actions/core', () => ({
  info: jest.fn(),
  getInput: jest.fn()
}))

describe('template', () => {
  describe('generateTemplate', () => {
    it('should generate the default template', () => {
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
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'James Ives',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
                  }
                },
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PUBLIC,
                  tier: {
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'Montezuma Ives',
                    login: 'MontezumaIves',
                    url: 'https://github.com/MontezumaIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /><span>{{ websiteUrl}}</span></a>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/JamesIves"><img src="https://github.com/JamesIves.png" width="60px" alt="" /><span>https:&#x2F;&#x2F;jamesiv.es</span></a><a href="https://github.com/MontezumaIves"><img src="https://github.com/MontezumaIves.png" width="60px" alt="" /><span>https:&#x2F;&#x2F;jamesiv.es</span></a>'
      )
    })

    it('should generate the default template and sanitize user inputs', () => {
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
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: '><h1>HELLO!!!!</h1>',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
                  }
                },
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PUBLIC,
                  tier: {
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: '><h1>HELLO!!!!</h1>',
                    login: 'MontezumaIves',
                    url: 'https://github.com/MontezumaIves"><h1>HELLO!!!!</h1>',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="{{ name }}" /><span>{{ websiteUrl}}</span></a>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/JamesIves"><img src="https://github.com/JamesIves.png" width="60px" alt="&amp;gt;HELLO!!!!" /><span>https:&#x2F;&#x2F;jamesiv.es</span></a><a href="https://github.com/MontezumaIves"><img src="https://github.com/MontezumaIves.png" width="60px" alt="&amp;gt;HELLO!!!!" /><span>https:&#x2F;&#x2F;jamesiv.es</span></a>'
      )
    })

    it('should fallback to url if websiteUrl is not provided', () => {
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
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'James Ives',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: null,
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
                  }
                },
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PUBLIC,
                  tier: {
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'Montezuma Ives',
                    login: 'MontezumaIves',
                    url: 'https://github.com/MontezumaIves',
                    websiteUrl: null,
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="{{ websiteUrl }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https:&#x2F;&#x2F;github.com&#x2F;JamesIves"><img src="https://github.com/JamesIves.png" width="60px" alt="" /></a><a href="https:&#x2F;&#x2F;github.com&#x2F;MontezumaIves"><img src="https://github.com/MontezumaIves.png" width="60px" alt="" /></a>'
      )
    })

    it('should filter out sponsors who are marked as private', () => {
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
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'James Ives',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
                  }
                },
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PRIVATE,
                  tier: {
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'Montezuma Ives',
                    login: 'MontezumaIves',
                    url: 'https://github.com/MontezumaIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
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

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/JamesIves"><img src="https://github.com/JamesIves.png" width="60px" alt="" /></a>'
      )
    })

    it('should anonymize private data if includePrivate is true', () => {
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
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'James Ives',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
                  }
                },
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PRIVATE,
                  tier: {
                    monthlyPriceInCents: 5000
                  },
                  sponsorEntity: {
                    name: 'Montezuma Ives',
                    login: 'MontezumaIves',
                    url: 'https://github.com/MontezumaIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="{{ avatarUrl }}" width="60px" alt="" /></a>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: true
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/JamesIves"><img src="https:&#x2F;&#x2F;avatars.githubusercontent.com&#x2F;u&#x2F;10888441?v&#x3D;4" width="60px" alt="" /></a><a href="https://github.com/"><img src="https:&#x2F;&#x2F;raw.githubusercontent.com&#x2F;JamesIves&#x2F;github-sponsors-readme-action&#x2F;dev&#x2F;.github&#x2F;assets&#x2F;placeholder.png" width="60px" alt="" /></a>'
      )
    })

    it('should filter out sponsors who do not meet the minimum threshold', () => {
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
                    monthlyPriceInCents: 6000
                  },
                  sponsorEntity: {
                    name: 'James Ives',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
                  }
                },
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PUBLIC,
                  tier: {
                    monthlyPriceInCents: 100
                  },
                  sponsorEntity: {
                    name: 'Montezuma Ives',
                    login: 'MontezumaIves',
                    url: 'https://github.com/MontezumaIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: true
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/JamesIves"><img src="https://github.com/JamesIves.png" width="60px" alt="" /></a>'
      )
    })

    it('should filter out sponsors who are above the maximum threshold', () => {
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
                    monthlyPriceInCents: 9000
                  },
                  sponsorEntity: {
                    name: 'James Ives',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
                  }
                },
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PUBLIC,
                  tier: {
                    monthlyPriceInCents: 11000
                  },
                  sponsorEntity: {
                    name: 'Montezuma Ives',
                    login: 'MontezumaIves',
                    url: 'https://github.com/MontezumaIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 0,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/JamesIves"><img src="https://github.com/JamesIves.png" width="60px" alt="" /></a>'
      )
    })

    it('should only show sponsors who are above the minimum but below the maximum', () => {
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
                    monthlyPriceInCents: 9000
                  },
                  sponsorEntity: {
                    name: 'James Ives',
                    login: 'JamesIves',
                    url: 'https://github.com/JamesIves',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/JamesIves"><img src="https://github.com/JamesIves.png" width="60px" alt="" /></a>'
      )
    })

    it('should display the fallback if no sponsors match the parameters', () => {
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: 'There are no sponsors in this tier',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(action.fallback)
    })
  })

  describe('generateFile', () => {
    it('should read an existing file and write to it without throwing', async () => {
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: 'There are no sponsors in this tier',
        activeOnly: true,
        includePrivate: false
      }

      // Write temp README file for testing
      await promises.writeFile(
        'README.test.md',
        'Generated README file for testing <!-- sponsors --><!-- sponsors --> - do not commit'
      )

      expect(await generateFile(response, action)).toBe(Status.SUCCESS)
    })

    it('should go into a skipped state if there is no marker found in the template', async () => {
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: 'There are no sponsors in this tier',
        activeOnly: true,
        includePrivate: false
      }

      // Purposely write incorrect data
      await promises.writeFile(
        'README.test.md',
        'Generated README file for testing <!-- sponsorrrr --><!-- sponsors --> - do not commit'
      )

      expect(await generateFile(response, action)).toBe(Status.SKIPPED)
    })

    it('should catch when a function throws an error', async () => {
      ;(info as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Mocked throw')
      })

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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/10888441?v=4'
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
                    avatarUrl:
                      'https://avatars.githubusercontent.com/u/78580739?v=4'
                  }
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: 'There are no sponsors in this tier',
        activeOnly: true,
        includePrivate: false
      }

      try {
        await generateFile(response, action)
      } catch (error) {
        expect(error instanceof Error && error.message).toBe(
          'There was an error generating the updated file: Mocked throw ❌'
        )
      }
    })
  })

  describe('getSponsors', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should return some data as user', async () => {
      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: 'There are no sponsors in this tier',
        activeOnly: true,
        includePrivate: false
      }

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({data: '12345'})
      })

      const data = await getSponsors(action)

      expect(data).toEqual({data: '12345'})
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/graphql',
        expect.any(Object)
      )
    })

    it('should return some data as organization', async () => {
      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: true,
        fallback: 'There are no sponsors in this tier',
        activeOnly: true,
        includePrivate: false
      }

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({data: '12345'})
      })

      const data = await getSponsors(action)

      expect(data).toEqual({data: '12345'})
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/graphql',
        expect.any(Object)
      )
    })

    it('should appropriately handle an error', async () => {
      ;(info as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Mocked throw')
      })

      const action = {
        token: '123',
        file: 'README.test.md',
        template:
          '<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="" /></a>',
        minimum: 6000,
        maximum: 10000,
        marker: 'sponsors',
        organization: true,
        fallback: 'There are no sponsors in this tier',
        activeOnly: true,
        includePrivate: false
      }

      try {
        await getSponsors(action)
      } catch (error) {
        expect(error instanceof Error && error.message).toBe(
          'There was an error with the GitHub API request: Mocked throw ❌'
        )
      }
    })
  })
})
