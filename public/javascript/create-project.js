// Clear form
function clearCreateProjectForm() {
    // Clear form
    document.getElementById('create-project-name').value = '';
    document.getElementById('create-project-repo').value = '';
    document.getElementById('create-project-repo-owner').value = '';
}
  
// Create new issue handler
async function createProject(event) {
    event.preventDefault();

    // Get form values to pass as object
    const name = document.getElementById('create-project-name').value;
    const github_repo_name = document.getElementById('create-project-repo').value;
    const github_username = document.getElementById('create-project-repo-owner').value;

    // check if minimum values are provided
    if(name && github_repo_name && github_username) {

        // Post data to /api/project/ route
        const response = await fetch(`/api/project/`, {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                github_repo_name: github_repo_name,
                github_username: github_username
            }),
            headers: {
            'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    } else {
        alert('Missing information.');
    }
    // Close modal
    $('#create-project-modal').modal('hide');
    clearCreateProjectForm();
}

// Create Project Submit Listener
document.getElementById('create-project-form').addEventListener('submit', createProject);
 