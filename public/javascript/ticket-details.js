const previousIssueEl = document.getElementById('previous-issue-select-container');

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
function assignToPreviousHandler() {
    alert('assign to previous');
}

document.getElementById('convert-ticket-btn').addEventListener('click', createIssueHandler);
document.getElementById('assign-previous-ticket-btn').addEventListener('click', assignToPreviousHandler);
document.getElementById('delete-ticket-btn').addEventListener('click', deleteTicketHandler);