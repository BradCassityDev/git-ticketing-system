
// Create new issue handler
async function createIssue(event) {
    event.preventDefault();
    const title = document.getElementById('create-issue-title').value;
    const dueDate = document.getElementById('create-issue-duedate').value;
    const priority = "Blah";
    const assignees = document.getElementById('create-issue-assignees').value; 
    const labels = document.getElementById('create-issue-assignees').value; 
    const description = document.getElementById('create-issue-body').value;
    const projectId = 1; // Need to grab somewhere

    // create issue object for route
    const issueData = {
        due_date: dueDate,
        priority: priority,
        issueState_id: 1,
        project_id: projectId,
        data: {
            title: title,
            body: description,
            assignees: assignees,
            state: 'open',
            labels: labels
        }
    };

    console.log(issueData);

    if(title && description && dueDate && priority) {
        const response = await fetch(`/api/issue/`, {
            method: 'POST',
            body: JSON.stringify({issueData}),
            headers: {
              'Content-Type': 'application/json'
            }
          });
        
          if (response.ok) {
            console.log(response);
            //document.location.replace('/dashboard/')
          } else {
            alert(response.statusText);
        }
    } else {
        alert('Missing information.');
    }

}
  
document.getElementById('create-issue-form').addEventListener('submit', createIssue);