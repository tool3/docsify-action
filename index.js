const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('@actions/exec');

async function run() {
  try {
    const { payload } = github.context;
    const args = {};

    // get input credentials
    const inputUser = core.getInput('user');
    const inputEmail = core.getInput('email');

    if (payload.head_commit) {
      args.email = payload.head_commit.committer.email;
      args.username = payload.head_commit.committer.username;
      args.message = payload.head_commit.message;
    }

    const { email, username } = args;

    const userName = inputUser || username;
    const userEmail = inputEmail || email;

    if (!userName || !userEmail) {
      const errorMessage = `failed to extract username or email from github context, please provide 'username' and 'email' through the workflow file.`;
      return core.setFailed(errorMessage);
    }

    // get input
    const destinationDir = core.getInput('dir');
    const docsifyArgs = core.getInput('docsify_args');
    const commitMsg = core.getInput('commit_msg');
    const destBranch = core.getInput('branch');

    const docsArgs = ['docsify-cli', 'init', destinationDir];

    if (docsifyArgs) {
      docsArgs.push(docsifyArgs);
    }

    // generate docs
    await exec('npx', docsArgs);

    // push dist
    await exec('git', ['config', '--local', 'user.name', userName]);
    await exec('git', ['config', '--local', 'user.email', userEmail]);
    await exec('git', ['add', '.']);
    await exec('git', ['commit', '-a', '-m', commitMsg]);
    await exec('git', ['push', 'origin', `HEAD:${destBranch}`]);
  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
