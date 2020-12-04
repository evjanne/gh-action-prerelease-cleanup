const core = require("@actions/core");
const semver = require("semver");
const { getOctokit, context } = require("@actions/github");

exports.run = async function () {
  const token = core.getInput("github-token", { required: true });
  const octokit = getOctokit(token);
  const { owner, repo } = context.repo
  const options = octokit.repos.listReleases.endpoint.merge({owner,repo})
  const releases = await octokit.paginate(options)
  const latestRelease = releases.filter(release => !release.prerelease).map((release) => release.tag_name).sort(semver.rcompare).shift();
  const outdatedPrereleases = releases.filter(release => release.prerelease).filter(release => semver.lt(release.tag_name, latestRelease))
  console.log(`Latest release is ${latestRelease}`);
  console.log("Outdated prereleases are:")
  console.log(JSON.stringify(outdatedPrereleases))
};

