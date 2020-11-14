const { getRepoDetails, getRepoIssues, issueDetails, createIssue, updateIssue } = require('./github');

// Sync and compare github repos
async function syncGithubIssues(projectData) {
    // Return GitHub repository details for evaulation 
    const repoDetailResults = await getRepoDetails("TotallyFakeRepoNameThatWouldNeverExists", projectData.github_repo_name);
   //projectData.github_username
    // Verify that the repo exists
    console.log(repoDetailResults);

    if (repoDetailResults.exists == false) {
        // Repository does not exists
        return repoDetailResults;
    } else {
        // Repository verified

        // Get repository issues from GitHub
        //const repoIssueResults = getRepoIssues(projectData.github_username, projectData.github_username);
        return repoDetailResults;
    }
}

module.exports = {
    syncGithubIssues
}