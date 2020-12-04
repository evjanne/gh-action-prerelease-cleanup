const core = require("@actions/core");
const semver = require("semver");
const { getOctokit, context } = require("@actions/github");

exports.run = async function () {
  const token = core.getInput("github-token", { required: true });
  const deleteTags = core.getInput("delete-tags") === "true";
  const octokit = getOctokit(token);
  const { owner, repo } = context.repo
  const options = octokit.repos.listReleases.endpoint.merge({owner,repo})
  const releases = await octokit.paginate(options)
  const latestRelease = releases.filter(release => !release.prerelease).map((release) => release.tag_name).sort(semver.rcompare).shift();
  const outdatedPrereleases = releases.filter(release => release.prerelease).filter(release => semver.lt(release.tag_name, latestRelease, {includePrerelease: true}))
  console.log(`Latest release is ${latestRelease}`);
  console.log("Outdated prereleases are:")
  outdatedPrereleases.map((prerelease) => console.log(prerelease.tag_name));
  console.log(JSON.stringify(outdatedPrereleases))
  await Promise.all(outdatedPrereleases.map(
      async (prerelease) => {
          await octokit.repos.deleteRelease({owner, repo, release_id: prerelease.id})
          if (deleteTags) {
            console.log("Deleting tags")
            console.log(deleteTags)
            console.log(core.getInput("delete-tags"))
            await octokit.git.deleteRef({ owner, repo, ref: `tags/${prerelease.tag_name}`})
          }
      }
  ))
};

