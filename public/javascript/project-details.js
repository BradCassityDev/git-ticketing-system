const teamDDContainerEl = document.getElementById('team-dropdown-container');

// Return list of options for Team dropdown
function getTeamsForDropdown() {
    fetch('/api/team')
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // Get current porject team_id to set as default in select field
                    const currentTeamId = teamDDContainerEl.getAttribute('data-team-id');

                    // Clear out previous dropdown
                    teamDDContainerEl.innerHTML = '';

                    // Create select dropdown options
                    let teamDDSelectEl = document.createElement('select');
                    teamDDSelectEl.classList.add("form-control");
                    teamDDSelectEl.id = 'project-team';
                    teamDDSelectEl.name = 'project-team';

                    let defaultOption = document.createElement('option');
                    defaultOption.text = 'Select a team...';
                    defaultOption.value = 0;
                    teamDDSelectEl.appendChild(defaultOption);

                    // Loop through teams and create option tag
                    for (let i = 0; i < data.length; i++) {
                        // Create options for all returned teams
                        let option = document.createElement('option');
                        option.value = data[i].id;
                        option.text = data[i].name;

                        // Check if team is associated to project already
                        if (data[i].id === parseInt(currentTeamId)) {
                            option.setAttribute('selected', 'selected');
                        }

                        // Include option in dropdown
                        teamDDSelectEl.add(option);
                    }

                    // Append Team Dropdown to container
                    teamDDContainerEl.appendChild(teamDDSelectEl);
                });
            } else {
                alert('No teams found');
            }
        })
        .catch(err => {
            console.log(err);
            alert('No teams found.');
        });
}

// Update Project Details Handler 
async function updateProjectDetails(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ]; 
    const projectName = document.getElementById('project-name').value;
    const githubRepo = document.getElementById('project-github-repo').value;
    const githubUser = document.getElementById('project-github-owner').value;
    const projectStateId = document.getElementById('project-state').value;
    const projectTeamId = document.getElementById('project-team').value;

    const updateObject = {
        name: projectName,
        github_repo_name: githubRepo,
        github_username: githubUser,
        project_state_id: projectStateId
    }

    // Include projectTeamId if above 0
    if (parseInt(projectTeamId) > 0) {
        updateObject.team_id = projectTeamId;
    }

    // Fetch /api/project/:id and update project details
    const response = await fetch(`/api/project/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateObject),
        headers: {
        'Content-Type': 'application/json'
        }
    })
    
    if (response.ok) {
        document.location.replace('/admin');
    } else {
        alert('response.status');
    }

    
}

// Update Project Details Listener
document.getElementById('save-project-changes').addEventListener('click', updateProjectDetails);

// Load teams on page load
getTeamsForDropdown();