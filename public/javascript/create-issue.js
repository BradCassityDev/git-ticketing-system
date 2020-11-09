
// Create new issue handler
async function createIssue(event) {
    event.preventDefault();
    const title = document.getElementById('create-issue-title').value;
    const dueDate = document.getElementById('create-issue-duedate').value;
    const priority = "Blah";
    const assignees = document.getElementById('create-issue-assignees').value; 
    const labels = document.getElementById('create-issue-assignees').value; 
    const description = document.getElementById('create-issue-body').value;
    const projectId = 3; // Need to grab somewhere
    
    console.log(assignees);
    console.log(labels);

    if(title && description && dueDate && priority) {
        const response = await fetch(`/api/issue/`, {
            method: 'POST',
            body: JSON.stringify({
              due_date: dueDate,
              priority: priority,
              issueState_id: 1,
              project_id: projectId,
              data: {
                  title: title,
                  body: description,
                  state: 'open',
              }
            }),
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