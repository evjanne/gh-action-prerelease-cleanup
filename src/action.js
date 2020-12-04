const core = require("@actions/core");
const { getOctokit, context } = require("@actions/github");

exports.run = async function () {
  const token = core.getInput("github-token", { required: true });
  const octokit = getOctokit(token);
  const currentRelease = await getCurrentRelease();
  const relases = await octokit.paginate(octokit.repos.listReleases.endpoint.merge(context.repo))
  console.log(JSON.stringify(relases.data))
};

async function getCurrentRelease() {}
