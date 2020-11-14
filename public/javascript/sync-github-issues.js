// Sync GitHub Issues Handler
async function syncGithubIssues(event) {
    event.preventDefault();

    // Get Project ID from button data-project
    const id = document.getElementById('sync-repo-issues-btn').getAttribute('data-project');

    // Call the endpoint to sync GitHub issues
    const response = await fetch(`/api/project/sync/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application-json'}
    });

    console.log(response.json());
            if(response.ok) {
                console.log(response.exists);
                //document.location.reload();
            } else {
                console.log(response);
                alert(JSON.parse(response.body));
            }
}

// Sync GitHub Issues Button Listener 
document.getElementById('sync-repo-issues-btn').addEventListener('click', syncGithubIssues);