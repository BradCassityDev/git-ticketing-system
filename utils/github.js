const axios = require('axios');
require('dotenv').config();
const auth = 'Basic ' + process.env.GITHUB_TOKEN;
const basicAuth = {
    username: process.env.GITHUB_USER,
    password: process.env.GITHUB_PASS
}

// Return Repo Details
async function getRepoDetails(githubUser, repoName) {
    return await axios.get(`https://api.github.com/repos/${githubUser}/${repoName}`, {
        Authorization: basicAuth
    })
        .then(response => {
            return {
                exists: true,
                data: response.data
            };
        })
        .catch(error => {
            console.log(error);
            return { exists: false };
        });
}

// Return Repo Issues (whether closed or not) 
function getRepoIssues(githubUser, repoName) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.github.com/repos/${githubUser}/${repoName}/issues?state=all`, {
            Authorization: basicAuth
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

// Return Issue Details
function issueDetails(githubUser, repoName, issueNum) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.github.com/repos/${githubUser}/${repoName}/issues/${issueNum}`, {
            Authorization: basicAuth
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

// Create Issue - See example request object below
function createIssue(githubUser, repoName, data) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        }
    };

    return new Promise((resolve, reject) => {
        axios.post(`https://api.github.com/repos/${githubUser}/${repoName}/issues`, data, config)
            .then((result) => {
                resolve(result.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// Update Issue - See example request object below
function updateIssue(githubUser, repoName, issueNum, data) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        }
    };

    return new Promise((resolve, reject) => {
        axios.post(`https://api.github.com/repos/${githubUser}/${repoName}/issues/${issueNum}`, data, config)
            .then((result) => {
                resolve(result.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = {
    getRepoDetails,
    getRepoIssues,
    issueDetails,
    createIssue,
    updateIssue
};

/*
Example Create/Update Body
{
    "githubUser": "BradCassityDev",
    "repoName": "temp-repo",
    "data": {
        "title": "Issue Title",
        "body": "Text content for issue",
        "assignees": [
            "BradCassityDev"
        ],
        "state": "open",
        "labels": [
            "bug"
        ]
    }
}
*/