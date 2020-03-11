const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('@actions/exec');

async function run() {
  try {
    const { pusher: { email, name } } = github.context.payload;

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
    await exec('git', ['config', '--local', 'user.name', name]);
    await exec('git', ['config', '--local', 'user.email', email]);
    await exec('git', ['add', '.']);
    await exec('git', ['commit', '-a', '-m',  commitMsg]);
    await exec('git', ['push', 'origin', `HEAD:${destBranch}`]);

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
