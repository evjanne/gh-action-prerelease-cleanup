const core = require("@actions/core");
const semver = require("semver");
const { getOctokit, context } = require("@actions/github");

exports.run = async function () {
  const token = core.getInput("github-token", { required: true });
  const octokit = getOctokit(token);
  const { owner, repo } = context.repo
  const options = octokit.repos.listReleases.endpoint.merge({owner,repo})
  console.log(options)
  const releases = await octokit.paginate(options)
  const latestRelease = releases.filter(release => !release.prerelease).map((release) => release.tag_name).sort(semver.rcompare).shift();
  console.log(`Latest release is ${latestRelease}`);
  console.log(JSON.stringify(releases))
};

