<p align="center">
  <a href="https://github.com/marketplace/actions/fetch-api-data">
    <img width="200px" src="./.github/assets/icon.png">
  </a>
</p>

<h1 align="center">
  ✨ GitHub Sponsors Readme Action ✨
</h1>

<p align="center">
  <a href="https://github.com/JamesIves/github-sponsors-readme-action/actions">
    <img src="https://github.com/JamesIves/github-sponsors-readme-action/workflows/unit-tests/badge.svg" alt="Unit test status badge">
  </a>
  
  <a href="https://github.com/JamesIves/github-sponsors-readme-action/actions">
    <img src="https://github.com/JamesIves/github-sponsors-readme-action/workflows/integration-tests/badge.svg" alt="Integration test status badge">
  </a>
  
  <a href="https://codecov.io/gh/JamesIves/github-sponsors-readme-action/branch/dev">
    <img src="https://codecov.io/gh/JamesIves/github-sponsors-readme-action/branch/dev/graph/badge.svg" alt="Code coverage status badge">
  </a>
  
  <a href="https://github.com/JamesIves/github-sponsors-readme-action/releases">
    <img src="https://img.shields.io/github/v/release/JamesIves/github-sponsors-readme-action.svg?logo=github" alt="Release version badge">
  </a>
</p>

<p align="center">
  This <a href="https://github.com/features/actions">GitHub Action</a> will automatically add your <a href="https://github.com/sponsors">GitHub Sponsors</a> to your README. It can be configured in multiple ways allowing you to display and breakdown your sponsors by price tier with fallbacks. It also includes templating support so you can display your sponsors how you'd like.
</p>

## Getting Started ✈️

You can include the action in your workflow to trigger on any event that [GitHub Actions supports](https://help.github.com/en/articles/events-that-trigger-workflows). You'll need to provide the action with a **Personal Access Token (PAT)** scoped to `user:read` (or `org:read` depending on your needs), and the file to parse.

```yml
name: Generate Sponsors README
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2

      - name: Generate Sponsors 💖
        uses: JamesIves/github-sponsors-readme-action@releases/beta
        with:
          token: ${{ secrets.PAT }}
          file: 'README.md'

      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          branch: main
          folder: '.'
```

You'll also need to the following `<!-- sponsors --><!-- sponsors -->` in your `.md` file so the action knows where to place the data.

```md
# Awesome Project

Go you!

## Sponsors

These are our really cool sponsors!

<!-- sponsors --><!-- sponsors -->
```


#### Install as a Node Module 📦

If you'd like to use the functionality provided by this action in your own action you can install it using [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/get-npm) by running the following commands. It's available on both the [npm](https://www.npmjs.com/package/@jamesives/github-sponsors-readme-action) and [GitHub registry](https://github.com/JamesIves/github-sponsors-readme-action/packages/229982). 

```
yarn add @jamesives/github-sponsors-readme-action
```

```
npm install @jamesives/github-sponsors-readme-action
```

It can then be imported into your project like so.

```javascript
import run from "@jamesives/github-sponsors-readme-action";

run(configuration)
```

Calling the functions directly will require you to pass in an object containing the variables found in the [configuration section](https://github.com/JamesIves/github-sponsors-readme-action#configuration-).

## Configuration 📁

The `with` portion of the workflow **must** be configured before the action will work. You can add these in the `with` section found in the examples above. Any `secrets` must be referenced using the bracket syntax and stored in the GitHub repository's `Settings/Secrets` menu. You can learn more about setting environment variables with GitHub actions [here](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets).

#### Required Setup

The following options must be configured.

| Key     | Value Information                                                                                                                                                                                                                                                                                                                       | Type   | Required |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| `token` | You must provide the action with a Personal Access Token (PAT) with either the `user:read` or `org:read` permission scope and store it in the `secrets / with` menu **as a secret**. This should be generated from the account or organization that recieves sponsorship. [Learn more about creating and using encrypted secrets here]. | `with` | **Yes**  |
| `file`  | This should point to the file that you're generating, for example `README.md` or `path/to/CREDITS.md`. Defaults to `README.md` if no value is provided.                                                                                                                                                                                 | `with` | **Yes**  |

#### Optional Choices

| Key            | Value Information                                                                                                                                                                                                                                                                      | Type   | Required |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| `organization` | If you're displaying sponsorship information as an organization you should toggle this option to `true`. You also need to provide the action with an `org:read` scoped PAT.                                                                                                            | `with` | **No**   |
| `minimum`      | Using this input you can set the minimum sponsorship threshold. For example setting this to `500` will only display sponsors who give of `$5 USD` and more. By default the action will display all of your sponsors.                                                                   | `with` | **No**   |
| `maximum`      | Using this input you can set the minimum sponsorship threshold. For example setting this to `500` will only display sponsors who give of `$5 USD` and less. By default the action will display all of your sponsors.                                                                   | `with` | **No**   |
| `marker`       | This allows you to modify the marker comment that is placed in your file. By default this is set to sponsors - `<!-- sponsors --> <!-- sponsors -->`, if you set this to `gold` for example you can place `<!-- gold --> <!-- gold -->` in your file. | `with` | **No**   |
| `fallback`     | Allows you to specify a fallback if you have no sponsors. By default nothing is displayed.                                                                                                                                                                                             | `with` | **No**   |
| `template`     | Allows you to modify the default template. Please refer to the `template` section of this README for more information.                                                                                                                                                                 | `with` | **No**   |

#### Deployment Status

The action will export a step output as `sponsorship-status` that you can use in your workflow to determine if the task was successful or not. You can find an explanation of each status type below.

| Status    | Description                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `success` | The `success` status indicates that the action was able to successfully generate the README.            |
| `failed`  | The `failed` status indicates that the action encountered an error while trying to generate the README. |

---

### Modifying the Template 🔧

You can modify the template that gets generated in your file by using the `template` input. This input allows you to leverage mustache templating to modify what is displayed. The following values are available.

| Status  | Description                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `name`  | The users full name. This can sometimes be `null` if the user hasn't set one. This can be accessed using `{{{ name }}}` |
| `login` | The users login, this can be accessed using `{{{ login }}}`                                                             |
| `url`   | The users GitHub profile url, this can be accessed using `{{{ url }}}`.                                                 |

You're able to use markdown or GitHub approved basic HTML. The default template can be found [here](./src/constants.ts#L28).

<details><summary>You can view a full example of this here.</summary>
<p>

```yml
name: Generate Sponsors README
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2

      - name: Generate Sponsors 💖
        uses: JamesIves/github-sponsors-readme-action@releases/beta
        with:
          token: ${{ secrets.PAT }}
          file: 'README.md'
          template: '* [{{{ name }}}]({{{ url }}}) - {{{ login }}}'

      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          branch: main
          folder: '.'
```

```md
# Awesome Project

Go you!

## Sponsors

These are our really cool sponsors!

<!-- sponsors --><!-- sponsors -->
```

</p>
</details>

---

### Seperating by Sponsorship Tier ✨

If you'd like to highlight certain users who contribute to a specific sponsorship tier you can do so using a combination of the `minimum`, `maximum` and `marker` inputs. The `minimum / maximum` inputs equal their dollar contribution in cents.

<details><summary>You can view a full example of this here.</summary>
<p>

```yml
name: Generate Sponsors README
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2

      - name: Generate Sponsors 💖
        uses: JamesIves/github-sponsors-readme-action@releases/beta
        with:
          token: ${{ secrets.PAT }}
          file: 'README.md'
          minimum: 500
          maximum: 999
          marker: 'silver'

      - name: Generate Sponsors 💖
        uses: JamesIves/github-sponsors-readme-action@releases/beta
        with:
          token: ${{ secrets.PAT }}
          file: 'README.md'
          minimum: 1000
          marker: 'gold'

      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          branch: main
          folder: '.'
```

```md
# Awesome Project

Go you!

## Gold Sponsors

<!-- gold -->
<!-- gold -->

## Silver Sponsors

<!-- silver -->
<!-- silver -->
```

</p>
</details>
