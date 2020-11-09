// Create new issue handler
async function createIssue(event) {
    event.preventDefault();

    // Get form values to pass as object
    const title = document.getElementById('create-issue-title').value;
    const dueDate = document.getElementById('create-issue-duedate').value;
    const priority = "Blah";
    const assignees = document.getElementById('create-issue-assignees').value; 
    const labels = document.getElementById('create-issue-assignees').value; 
    const description = document.getElementById('create-issue-body').value;
    const projectId = document.getElementById('project-dropdown').value;

    // check if minimum values are provided
    if(projectId && title && description && dueDate && priority) {

        // Post data to /api/project/ route
        const response = await fetch(`/api/project/`, {
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

// Return list of projects for dropdown
async function openCreateIssueModal() {
  await fetch('/api/project')
        .then(response => {
          if (response.ok) {
            response.json().then(data => {
              let createIssueFormEl = document.getElementById('project-dropdown-container');
              
              // Create a dom select element for project dropdown
              let projectDDEl = document.createElement('select');
              projectDDEl.classList.add("form-control");
              projectDDEl.id = "project-dropdown";
              projectDDEl.name = "project-dropdown";

              console.log(projectDDEl)

              // Loop through returned projects and create an option for each
              for (let i = 0; i < data.length; i++) {
                var option = document.createElement("option");
                option.text = data[i].name;
                option.value = data[i].id;

                // Add option to the project select element
                projectDDEl.add(option);
              }

              // Append the selected element to the container
              createIssueFormEl.appendChild(projectDDEl);
            });
          } else {
            alert('No projects found');
          }
        })
        .catch(err => {
          console.log(err);
          alert('No projects found');
        });
}
  
document.getElementById('create-issue-form').addEventListener('submit', createIssue);
document.getElementById('create-issue-modal-btn').addEventListener('click', openCreateIssueModal);