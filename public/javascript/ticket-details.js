// Assign Ticket to New Issue Handler
function createIssueHandler() {
    alert('create new issue');
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

// Set event listeners
document.getElementById('convert-ticket-btn').addEventListener('click', createIssueHandler);
document.getElementById('assign-previous-ticket-btn').addEventListener('click', assignToPreviousHandler);
document.getElementById('delete-ticket-btn').addEventListener('click', deleteTicketHandler);

// Load on page load
loadPreviousIssus();
