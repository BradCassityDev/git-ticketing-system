let teamID = null;

// Clear form
function clearCreateTeamForm() {
    // Clear form
    document.getElementById('create-team-name').value = '';
    teamID = null
}

// Prepare Edit Form
function prepareEditForm(id, teamName) {
    document.getElementById('create-team-name').value = teamName;
    document.getElementById('create-team-btn').innerHTML = 'Edit Team';
    document.getElementById('create-team-title').innerHTML = 'Edit Team';
    teamID = id;
}

function prepareCreateForm() {
    document.getElementById('create-team-name').value = '';
    document.getElementById('create-team-btn').innerHTML = 'Create Team';
    document.getElementById('create-team-title').innerHTML = 'Create Team';
    teamID = null
}

// Create new issue handler
async function createTeam(event) {
    event.preventDefault();

    // Get form values to pass as object
    const name = document.getElementById('create-team-name').value;

    // check if minimum values are provided
    if (name) {
        let method = 'POST';
        let id = '';
        if (teamID !== null) {
            method = 'PUT';
            id = teamID;
        }
        // Post data to /api/team/ route
        const response = await fetch(`/api/team/${id}`, {
            method: method,
            body: JSON.stringify({
                name: name,
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
    $('#create-team-modal').modal('hide');
    clearCreateTeamForm();
}

// Create Project Submit Listener
document.getElementById('create-team-form').addEventListener('submit', createTeam);
