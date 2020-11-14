const { getRepoDetails, getRepoIssues, issueDetails, createIssue, updateIssue } = require('./github');

// Sync and compare github repos
async function syncGithubIssues(projectData) {
    // Return GitHub repository details for evaulation 
    const repoDetailResults = await getRepoDetails(projectData.github_username, projectData.github_repo_name);

    // Verify that the repo exists
    if (repoDetailResults.exists) {
        // Repository verified
        // Get repository issues from GitHub
        //const repoIssueResults = getRepoIssues(projectData.github_username, projectData.github_username);
        return repoDetailResults;
    } else {
        // Repository does not exists
        return repoDetailResults;   
    }
}

module.exports = {
    syncGithubIssues
}