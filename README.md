# docsify-action 
github action that creates beautiful docs from your README!

# Create an action from this template
Click the `Use this Template` and provide the new repo details for your action

# Usage 
`docsify-action` allows you to quickly create beautiful docs from your existing `README` file.
```yaml
- uses: tool3/docsify-action@v1
  with:
    github_token: ${{ secrets.GP_TOKEN }}
```

# Options
### `github_token`
   **required**   
   Github access token
### `dir`
  destination directory   
  default: `docs`
### `branch`
  destination branch   
  default: `master`
### `docsify-args`
  extra docsify-cli arguments   
### `commit_msg`
  commit message used when pushing to destination branch     
  default: `docs update 📚`

# Example
```yaml
name: docs

on: [push]

jobs:
  bump:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: tool3/docsify-action@master
      with:
        github_token: ${{ secrets.GP_TOKEN }}
```