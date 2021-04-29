export interface ActionInterface {
  /** The template to use. */
  template: string
}

// Required action data that gets initialized when running within the GitHub Actions environment.
export const action = {
  template: '123'
}
