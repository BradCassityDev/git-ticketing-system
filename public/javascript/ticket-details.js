const userDDContainerEl = document.getElementById('user-dropdown-container');
const projectDDContainerEl = document.getElementById('project-dropdown-container');

// Return list of options for User dropdown
function getUserForDropdown() {
    fetch('/api/user')
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // Get current user_id to set as default in select field
                    const currentUserId = userDDContainerEl.getAttribute('data-user-id');

                    // Clear out previous dropdown
                    userDDContainerEl.innerHTML = '';

                    // Create select dropdown options
                    let userDDSelectEl = document.createElement('select');
                    userDDSelectEl.classList.add("form-control");
                    userDDSelectEl.id = 'issue-user';
                    userDDSelectEl.username = 'issue-user';

                    let defaultOption = document.createElement('option');
                    defaultOption.text = 'Select a user...';
                    defaultOption.value = 0;
                    userDDSelectEl.appendChild(defaultOption);

                    // Loop through users and create option tag
                    for (let i = 0; i < data.length; i++) {
                        // Create options for all returned users
                        let option = document.createElement('option');
                        option.value = data[i].id;
                        option.text = data[i].username;

                        // Include option in dropdown
                        userDDSelectEl.add(option);
                    }

                    // Append user Dropdown to container
                    userDDContainerEl.appendChild(userDDSelectEl);
                });
            } else {
                alert('No Users found');
            }
        })
        .catch(err => {
            console.log(err);
            alert('No users found.');
        });
}

function getProjectForDropdown() {
    fetch('/api/project')
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // Get current issue project_id to set as default in select field
                    const currentProjectId = projectDDContainerEl.getAttribute('data-project-id');

                    // Clear out previous dropdown
                    projectDDContainerEl.innerHTML = '';

                    // Create select dropdown options
                    let projectDDSelectEl = document.createElement('select');
                    projectDDSelectEl.classList.add("form-control");
                    projectDDSelectEl.id = 'issue-project';
                    projectDDSelectEl.name = 'issue-project';

                    let defaultOption = document.createElement('option');
                    defaultOption.text = 'Select a project...';
                    defaultOption.value = 0;
                    projectDDSelectEl.appendChild(defaultOption);

                    // Loop through users and create option tag
                    for (let i = 0; i < data.length; i++) {
                        // Create options for all returned users
                        let option = document.createElement('option');
                        option.value = data[i].id;
                        option.text = data[i].name;

                        // Include option in dropdown
                        projectDDSelectEl.add(option);
                    }

                    // Append user Dropdown to container
                    projectDDContainerEl.appendChild(projectDDSelectEl);
                });
            } else {
                alert('No Projects found');
            }
        })
        .catch(err => {
            console.log(err);
            alert('No Projects found.');
        });
}

// Assign Ticket to New Issue Handler
async function createIssueHandler() {
    event.preventDefault();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const issueUserId = document.getElementById('issue-user').value;
    const issueProjectId = document.getElementById('issue-project').value;


    const updateObject = {}

    // Include issueUserId if above 0
    if (parseInt(issueUserId) > 0) {
        updateObject.user_id = issueUserId;
    }

    if (parseInt(issueProjectId) > 0) {
        updateObject.project_id = issueProjectId;
    }
    // Create Fetch Request
    const response = await fetch(`/api/issue/ticket`, {
        method: 'POST',
        body: JSON.stringify(
            // updateObject
            {
            "user_id": issueUserId,
            "project_id": issueProjectId,
	        "ticket_id": id
        }
        ),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    if (response.ok) {
        // Go back to ticket center page
        document.location.replace('/admin/ticket');
    } else {
        alert(response.statusText);
    }
    // alert('create new issue');
}   

// Delete Ticket Handler
async function deleteTicketHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    // Delete Fetch Request
    const response = await fetch(`/api/ticket/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

    if (response.ok) {
        // Go back to ticket center page
        document.location.replace('/admin/ticket');
    } else {
        alert(response.statusText);
    }
}   

// Assign to Previous Handler
async function assignToPreviousHandler() {
    // Get value of issue
    const issueId = document.getElementById('assign-issue-dropdown').value;
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    // check if issueId is valid
    if (issueId && parseInt(issueId) > 0) {
        const response = await fetch(`/api/ticket/issue/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                issue_id: issueId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Go back to issue center page
            document.location.replace('/admin/ticket');
        } else {
            alert(response.statusText);
        }
    } else {
        alert('You must select an existing issue.');
    }
}

// Load previous issues for dropdown
async function loadPreviousIssus() {
    await fetch('/api/issue')
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    let previousIssueEl = document.getElementById('previous-issue-select-container');

                    // Create dropdown dom object for previous list
                    let issueDDEl = document.createElement('select');
                    issueDDEl.classList.add("form-control");
                    issueDDEl.id = "assign-issue-dropdown";
                    issueDDEl.name = "assign-issue-dropdown";

                    // Include blank option
                    let optionDefault = document.createElement("option");
                    optionDefault.text = "Select a project..."
                    optionDefault.value = "0";
                    issueDDEl.add(optionDefault);

                    // Loop through returned issues
                    for (let i = 0; i < data.length; i++) {
                        let option = document.createElement("option");
                        option.text = `Project: ${data[i].project.name} - Issue ID: ${data[i].id}`;
                        option.value = data[i].id;

                        // Add to select
                        issueDDEl.add(option);
                    }
                    
                    // Append to container in modal
                    previousIssueEl.appendChild(issueDDEl);
                })
            } else {
                alert('No previous issues found.');
            }
        })
        .catch(err => {
          console.log(err);
          alert('No projects found');
        });
}
const DDContainerEl = document.getElementById('team-dropdown-container');

// Return list of options for Team dropdown

async function updateTicketDetails(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ]; 
    const ticketStateId = document.getElementById('ticket-state').value;

    const updateObject = {
        ticket_state_id: ticketStateId
    }

    // Fetch /api/ticket/:id and update user details
    const response = await fetch(`/api/ticket/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateObject),
        headers: {
        'Content-Type': 'application/json'
        }
    })
    
    if (response.ok) {
        document.location.replace('/admin/ticket');
    } else {
        alert('response.status');
    }

    
}

// Set event listeners
document.getElementById('convert-ticket-btn').addEventListener('click', createIssueHandler);
document.getElementById('assign-previous-ticket-btn').addEventListener('click', assignToPreviousHandler);
document.getElementById('delete-ticket-btn').addEventListener('click', deleteTicketHandler);
document.getElementById('save-ticket-changes').addEventListener('click', updateTicketDetails);

// Load on page load
loadPreviousIssus();
getProjectForDropdown();
getUserForDropdown();
