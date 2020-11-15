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
                    teamDDSelectEl.id = 'user-team';
                    teamDDSelectEl.name = 'user-team';

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

                        // Check if team is associated to user already
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

// Update User Details Handler 
async function updateUserDetails(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ]; 
    const username = document.getElementById('username').value;
    const userEmail = document.getElementById('user-email').value;
    const userPhone = document.getElementById('user-phone').value;
    const userRoleId = document.getElementById('user-role').value;
    const userStateId = document.getElementById('user-state').value;
    const userTeamId = document.getElementById('user-team').value;

    const updateObject = {
        username: username,
        email: userEmail,
        phone: userPhone,
        role_id: userRoleId,
        user_state_id: userStateId,
    }

    // Include userTeamId if above 0
    if (parseInt(userTeamId) > 0) {
        updateObject.team_id = userTeamId;
    }

    // Fetch /api/user/:id and update user details
    const response = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateObject),
        headers: {
        'Content-Type': 'application/json'
        }
    })
    
    if (response.ok) {
        document.location.replace('/admin/user');
    } else {
        alert('response.status');
    }

    
}

// Update User Details Listener
document.getElementById('save-user-changes').addEventListener('click', updateUserDetails);

// Load teams on page load
getTeamsForDropdown();