import { setFailed, getInput, setOutput } from '@actions/core';
import github from '@actions/github';
import { exec } from '@actions/exec';

async function run() {
  try {
    console.log(process.env);
    const { payload } = github.context;
    type Args = Record<string, string>;

    const args: Args = {};

    // get input credentials
    const inputUser = getInput('user');
    const inputEmail = getInput('email');

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
      return setFailed(errorMessage);
    }

    // get input
    const destinationDir = getInput('dir');
    const docsifyArgs = getInput('docsify_args');
    const commitMsg = getInput('commit_msg');
    const destBranch = getInput('branch');

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
    setFailed(`Failed to publish ${error.message}`);
  }
}

run();
