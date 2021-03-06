// Clear form
function clearCreateIssueForm() {
  // Clear form
  document.getElementById('create-issue-title').value = "";
  document.getElementById('create-issue-duedate').value = "";
  document.getElementById('create-issue-labels').value = "";
  document.getElementById('create-issue-priority').value = "";
  document.getElementById('create-issue-body').value = "";
  document.getElementById('project-dropdown-container').value = "";
  document.getElementById('project-dropdown-container').innerHTML = "";
}

// Create new issue handler
async function createIssue(event) {
  event.preventDefault();

  // Get form values to pass as object
  const title = document.getElementById('create-issue-title').value;
  const dueDate = document.getElementById('create-issue-duedate').value;
  const priority = document.getElementById('create-issue-priority').value;
  const label = document.getElementById('create-issue-labels').value;
  const description = document.getElementById('create-issue-body').value;
  const projectId = document.getElementById('project-dropdown').value;

  // check if minimum values are provided
  if (projectId && title && description && dueDate && priority) {

    const data = {
      title: title,
      body: description,
      state: 'open'
    }

    if (label !== "no-label" && label) {
      data.labels = [label];
    }

    // Post data to /api/project/ route
    const response = await fetch(`/api/issue/`, {
      method: 'POST',
      body: JSON.stringify({
        due_date: dueDate,
        priority: priority,
        issueState_id: 1,
        project_id: projectId,
        data: data
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
    // Close modal
    $('#create-issue-modal').modal('hide');
    clearCreateIssueForm();
  } else {
    const missingInfo = []
    if (!projectId) {
      missingInfo.push("Project")
    } if (!title) {
      missingInfo.push("Title")
    } if (!priority) {
      missingInfo.push("Priority")
    } if (!dueDate) {
      missingInfo.push("Due Date")
    } if (!description) {
      missingInfo.push("Description")
    }
    alert('Missing information: ' + missingInfo.join(', '));
  }

}

// Return list of projects for dropdown
async function openCreateIssueModal() {
  await fetch('/api/project')
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          let createIssueFormEl = document.getElementById('project-dropdown-container');
          createIssueFormEl.innerHTML = "";

          // Create a dom select element for project dropdown
          let projectDDEl = document.createElement('select');
          projectDDEl.classList.add("form-control");
          projectDDEl.id = "project-dropdown";
          projectDDEl.name = "project-dropdown";

          // Include blank option
          let optionDefault = document.createElement("option");
          optionDefault.text = "Select a project..."
          projectDDEl.add(optionDefault);

          // Loop through returned projects and create an option for each
          for (let i = 0; i < data.length; i++) {
            let option = document.createElement("option");
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