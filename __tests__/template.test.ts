import {info} from '@actions/core'
import crypto from 'crypto'
import {promises} from 'fs'
import os from 'os'
import path from 'path'
import {GitHubResponse, PrivacyLevel, Status} from '../src/constants'
import {generateFile, generateTemplate, getSponsors} from '../src/template'

jest.setTimeout(60000)

jest.mock('@actions/core')

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
                    websiteUrl: 'https://jamesiv.es'
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
                    websiteUrl: 'https://jamesiv.es'
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
        '<a href="https://github.com/JamesIves"><img src="https:&#x2F;&#x2F;github.com&#x2F;JamesIves.png" width="60px" alt="" /></a><a href="https://github.com/"><img src="https:&#x2F;&#x2F;raw.githubusercontent.com&#x2F;JamesIves&#x2F;github-sponsors-readme-action&#x2F;dev&#x2F;.github&#x2F;assets&#x2F;placeholder.png" width="60px" alt="" /></a>'
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

    it('should generate the template using organization-level sponsorship data', () => {
      const response: GitHubResponse = {
        data: {
          organization: {
            sponsorshipsAsMaintainer: {
              totalCount: 1,
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
                    name: 'Acme Org Sponsor',
                    login: 'AcmeOrgSponsor',
                    url: 'https://github.com/AcmeOrgSponsor',
                    websiteUrl: 'https://acme.example',
                    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4'
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
        template: '<a href="https://github.com/{{ login }}">{{ name }}</a>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: true,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/AcmeOrgSponsor">Acme Org Sponsor</a>'
      )
    })

    it('should return the fallback when neither organization nor viewer sponsorship data is present', () => {
      const response: GitHubResponse = {data: {}}

      const action = {
        token: '123',
        file: 'README.test.md',
        template: '<a href="https://github.com/{{ login }}">{{ name }}</a>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: 'No sponsorship data available',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(action.fallback)
    })

    it('should downgrade triple mustache braces in a user-supplied template to force HTML escaping', () => {
      const response: GitHubResponse = {
        data: {
          viewer: {
            sponsorshipsAsMaintainer: {
              totalCount: 1,
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
                }
              ]
            }
          }
        }
      }

      const action = {
        token: '123',
        file: 'README.test.md',
        // Attempts raw/unescaped rendering via triple mustache braces.
        template: '<span>{{{ websiteUrl }}}</span>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      // If the downgrade were bypassed this would render the raw, un-escaped
      // 'https://jamesiv.es'. It should instead go through mustache's escaping.
      expect(generateTemplate(response, action)).toEqual(
        '<span>https:&#x2F;&#x2F;jamesiv.es</span>'
      )
    })

    it('treats a sponsor with no tier data as a $0/month pledge for both the minimum and maximum filters', () => {
      const response: GitHubResponse = {
        data: {
          viewer: {
            sponsorshipsAsMaintainer: {
              totalCount: 1,
              pageInfo: {
                endCursor: 'MQ'
              },
              nodes: [
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PUBLIC,
                  // No `tier` key at all.
                  sponsorEntity: {
                    name: 'Free Sponsor',
                    login: 'FreeSponsor',
                    url: 'https://github.com/FreeSponsor',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4'
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
        template: '<a href="https://github.com/{{ login }}"></a>',
        minimum: 0,
        maximum: 10000,
        marker: 'sponsors',
        organization: false,
        fallback: 'No sponsors',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<a href="https://github.com/FreeSponsor"></a>'
      )
    })

    it('excludes a tier-less sponsor once the minimum threshold is above 0', () => {
      const response: GitHubResponse = {
        data: {
          viewer: {
            sponsorshipsAsMaintainer: {
              totalCount: 1,
              pageInfo: {
                endCursor: 'MQ'
              },
              nodes: [
                {
                  createdAt: '123',
                  privacyLevel: PrivacyLevel.PUBLIC,
                  // No `tier` key at all.
                  sponsorEntity: {
                    name: 'Free Sponsor',
                    login: 'FreeSponsor',
                    url: 'https://github.com/FreeSponsor',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4'
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
        template: '<a href="https://github.com/{{ login }}"></a>',
        minimum: 100,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: 'No sponsors',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual('No sponsors')
    })

    it('falls back to an empty string when a sponsor has no name', () => {
      const response: GitHubResponse = {
        data: {
          viewer: {
            sponsorshipsAsMaintainer: {
              totalCount: 1,
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
                    name: null,
                    login: 'NamelessSponsor',
                    url: 'https://github.com/NamelessSponsor',
                    websiteUrl: 'https://jamesiv.es',
                    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4'
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
        template: '<span alt="{{ name }}">{{ login }}</span>',
        minimum: 0,
        maximum: 0,
        marker: 'sponsors',
        organization: false,
        fallback: '',
        activeOnly: true,
        includePrivate: false
      }

      expect(generateTemplate(response, action)).toEqual(
        '<span alt="">NamelessSponsor</span>'
      )
    })
  })

  describe('generateFile', () => {
    let fixtureFile: string

    beforeEach(() => {
      fixtureFile = path.join(
        os.tmpdir(),
        `gh-sponsors-readme-action-${crypto.randomUUID()}.md`
      )
    })

    afterEach(async () => {
      await promises.rm(fixtureFile, {force: true})
    })

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
        file: fixtureFile,
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
        fixtureFile,
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
        file: fixtureFile,
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
        fixtureFile,
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
        file: fixtureFile,
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
      const [url, requestInit] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toBe('https://api.github.com/graphql')
      const body = JSON.parse(requestInit.body)
      expect(body.query).toContain('viewer {')
      expect(body.query).not.toContain('organization (')
      expect(requestInit.headers.Authorization).toBe('Bearer 123')
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

      const originalOwner = process.env.GITHUB_REPOSITORY_OWNER
      process.env.GITHUB_REPOSITORY_OWNER = 'JamesIves'

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({data: '12345'})
      })

      const data = await getSponsors(action)

      expect(data).toEqual({data: '12345'})
      const [url, requestInit] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toBe('https://api.github.com/graphql')
      const body = JSON.parse(requestInit.body)
      expect(body.query).toContain('organization (login: "JamesIves")')
      expect(body.query).not.toMatch(/^\s*viewer\s*\{/m)
      expect(requestInit.headers.Authorization).toBe('Bearer 123')

      process.env.GITHUB_REPOSITORY_OWNER = originalOwner
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
