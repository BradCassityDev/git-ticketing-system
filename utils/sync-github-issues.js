const { getRepoDetails, getRepoIssues, issueDetails, createIssue, updateIssue } = require('./github');
const { User, Issue, Project, Issue_State, Project_State, Issue_User, Ticket } = require('../models/index');

// Sync and compare github repos
async function syncGithubIssues(projectData) {
    // Return GitHub repository details for evaulation 
    const repoDetailResults = await getRepoDetails(projectData.github_username, projectData.github_repo_name);

    // Verify that the repo exists
    if (repoDetailResults.exists) {
        // Repository verified
        // Get repository issues from GitHub
        const repoIssueResults = await getRepoIssues(projectData.github_username, projectData.github_repo_name);

        // Loop through returned github issues and compare to our db
        for (let i = 0; i < repoIssueResults.length; i++) {
            let isMatched = false;
            // Loop through and determine if issue already exists in our db
            for (let x = 0; x < projectData.issues.length; x++) {
                // Check if issue numbers match
                if (repoIssueResults[i].number === parseInt(projectData.issues[x].github_issue_number)) {
                    // Match
                    console.log(repoIssueResults[i].number + " - " + projectData.issues[x].github_issue_number);
                    isMatched = true;
                }
            }
            console.log(isMatched);


            // Create new issue in db
            if (!isMatched) {
                await Issue.create({
                    due_date: ' ',
                    priority: 'Medium',
                    github_issue_number: `${repoIssueResults[i].number}`,
                    project_id: projectData.id,
                    issue_state_id: 1,
                })
                    .then(issueData => {
                        return issueData
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }

        return repoDetailResults;
    } else {
        // Repository does not exists
        return repoDetailResults;   
    }
}

module.exports = {
    syncGithubIssues
}