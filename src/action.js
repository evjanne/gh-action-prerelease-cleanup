const core = require("@actions/core");
const { getOctokit, context } = require("@actions/github");

exports.run = async function () {
  const token = core.getInput("github-token", { required: true });
  const octokit = getOctokit(token);
  const currentRelease = await getCurrentRelease();
  const { owner, repo } = context.repo
  const relases = await octokit.paginate(octokit.repos.listReleases.endpoint.merge({owner, repo}))
  console.log(JSON.stringify(relases.data))
};

async function getCurrentRelease() {}
