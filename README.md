<h1 align="center">
  GitHub Sponsors Readme Action 💖
</h1>

<p align="center">
  <a href="https://github.com/JamesIves/github-pages-deploy-action/actions">
    <img src="https://github.com/JamesIves/github-pages-deploy-action/workflows/unit-tests/badge.svg" alt="Unit test status badge">
  </a>
  
  <a href="https://github.com/JamesIves/github-pages-deploy-action/actions">
    <img src="https://github.com/JamesIves/github-pages-deploy-action/workflows/integration-tests/badge.svg" alt="Integration test status badge">
  </a>
  
  <a href="https://codecov.io/gh/JamesIves/github-pages-deploy-action/branch/dev">
    <img src="https://codecov.io/gh/JamesIves/github-pages-deploy-action/branch/dev/graph/badge.svg" alt="Code coverage status badge">
  </a>
  
  <a href="https://github.com/JamesIves/github-pages-deploy-action/releases">
    <img src="https://img.shields.io/github/v/release/JamesIves/github-pages-deploy-action.svg?logo=github" alt="Release version badge">
  </a>
  
  <a href="https://github.com/marketplace/actions/deploy-to-github-pages">
    <img src="https://img.shields.io/badge/action-marketplace-blue.svg?logo=github&color=orange" alt="Github marketplace badge">
  </a>
</p>

<p align="center">

  This <a href="https://github.com/features/actions">GitHub Action</a> will automatically add your GitHub Sponsors to your README. It can be configured in multiple ways allowing you to display and breakdown sponsors by price tiers, and has templating so you can display your sponsors how you'd like.
</p>

## Getting Started ✈️
You can include the action in your workflow to trigger on any event that [GitHub Actions supports](https://help.github.com/en/articles/events-that-trigger-workflows). You'll need to provide the action with a Personal Access Token (PAT) scoped to `user:read` (or `org:read` depending on your needs), and the file to parse.

```yml
name: Generate README
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
        
      - name: Generate Sponsors 
        uses: JamesIves/github-sponsors-readme-action@releases/beta
        with:
          token: ${{ secrets.SPONSOR_TOKEN }}
          file: 'README.md'
  
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@releases/v4-alpha
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
