<h1 align="center">
  GitHub Sponsors Readme Action 💖
</h1>

<p align="center">
  This <a href="https://github.com/features/actions">GitHub Action</a> will automatically add your GitHub Sponsors to your README. It can be configured in multiple ways allowing you to display and breakdown sponsors by price tiers, and has templating so you can display your sponsors how you'd like.
</p>

## Getting Started ✈️
You can include the action in your workflow to trigger on any event that [GitHub Actions supports](https://help.github.com/en/articles/events-that-trigger-workflows). You'll need to provide the action with a Personal Access Token (PAT) scoped to `user:read` (or `org:read` depending on your needs), and the file to parse.

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
          token: ${{ secrets.SPONSOR_TOKEN }}
          file: 'README.md'
  
      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with: 
          branch: main
          folder: '.'
```

You'll also need to the following `<!-- sponsors --> <!-- sponsors -->` in your `.md` file so the action knows where to place the data.

```md
# Awesome Project

Go you!

## Sponsors

These are our really cool sponsors!

<!-- sponsors -->
<!-- sponsors -->
```

## Configuration 📁

The `with` portion of the workflow **must** be configured before the action will work. You can add these in the `with` section found in the examples above. Any `secrets` must be referenced using the bracket syntax and stored in the GitHub repository's `Settings/Secrets` menu. You can learn more about setting environment variables with GitHub actions [here](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets).

#### Required Setup

The following options must be configured.

| Key      | Value Information                                                                                                                                                                                                                                                                        | Type   | Required |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| `token` | You must provide the action with a Personal Access Token (PAT) with the `user:read` permission scope and stored in the `secrets / with` menu **as a secret**. This should be generated from the account or organization that recieves sponsorship. [Learn more about creating and using encrypted secrets here].                                                                                                                                                                                                            | `with` | **Yes**  |
| `file` | This should point to the file that you're generating, for example `README.md`.                                                                                                                                                                                                              | `with` | **Yes**  |