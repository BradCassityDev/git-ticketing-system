// Sync GitHub Issues Handler
async function syncGithubIssues(event) {
    event.preventDefault();

    // Get Project ID from button data-project
    const id = document.getElementById('sync-repo-issues-btn').getAttribute('data-project');

    // Call the endpoint to sync GitHub issues
    await fetch(`/api/project/sync/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application-json'}
    })
        .then(async response => {
            if (response.ok) {
                const newResult = await response.json();
                
                if (newResult.exists) {
                    // Sync Successful
                    alert('Sync Successful');
                    document.location.reload();
                } else {
                    // Sync Failed
                    alert('Sync Failed');
                    document.location.reload();
                }
            } else {
                console.log(response);
                alert(JSON.parse(response.body));
            }
        });
}

// Sync GitHub Issues Button Listener 
document.getElementById('sync-repo-issues-btn').addEventListener('click', syncGithubIssues);