const { getRepoIssues, issueDetails, createIssue, updateIssue } = require('../../utils/github');

// Sync and compare github repos
async function syncGithubIssues(projectData) {
    // Return GitHub repository details for evaulation 
    const repoDetailResults = getRepoDetails(projectData.github_username, projectData.github_username);

    // Verify that the repo exists
    if (repoDetailResults.message === "Not Found") {
        // Repository does not exists


    } else {
        // Repository verified

        // Get repository issues from GitHub
        const repoIssueResults = getRepoIssues(projectData.github_username, projectData.github_username);

        syncGithubIssues();
    }
}

module.exports = {
    syncGithubIssues
}