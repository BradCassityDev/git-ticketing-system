// Clear form
function clearCreateTeamForm() {
    // Clear form
    document.getElementById('create-team-name').value = '';
}
  
// Create new issue handler
async function createTeam(event) {
    event.preventDefault();

    // Get form values to pass as object
    const name = document.getElementById('create-team-name').value;

    // check if minimum values are provided
    if(name) {

        // Post data to /api/team/ route
        const response = await fetch(`/api/team/`, {
            method: 'POST',
            body: JSON.stringify({
                name: name,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log(response);
        } else {
            alert(response.statusText);
        }
    } else {
        alert('Missing information.');
    }
    // Close modal
    $('#create-team-modal').modal('hide');
    clearCreateTeamForm();
}

// Create Project Submit Listener
document.getElementById('create-team-form').addEventListener('submit', createTeam);
 