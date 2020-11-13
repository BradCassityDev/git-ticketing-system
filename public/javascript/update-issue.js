let currentTaskToEdit = null;

// edit new issue handler
async function updateIssueState(issue) {
  // TODO - get these from a server route
  const issueStates = [
    {
      id: 1,
      name: 'Opened'
    },
    {
      id: 2,
      name: 'In Progress'
    },
    {
      id: 3,
      name: 'Blocked'
    },
    {
      id: 4,
      name: 'Closed'
    }
  ];

  // Set the new status id for the issue
  for (let i = 0; i < issueStates.length; i++) {
    if (issueStates[i].name === issue.status) {
      issue.issue_state_id = issueStates[i].id;
    }
  }

  // Set body for PUT request
  let putBody = {
    issueState_id: issue.issue_state_id,
    project_id: issue.project_id,
    github_issue_number: issue.github_issue_number,
  };
  if (issue.status === 'Closed') {
    putBody.data = {
      state: 'closed'
    }
  }
  else {
    putBody.data = {
      state: 'open'
    }
  }

  // Post data to /api/project/ route
  const response = await fetch(`/api/issue/${issue.issue_id}`, {
    method: 'PUT',
    body: JSON.stringify(putBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    alert(response.statusText);
  }
}

// Clear form
function clearEditIssueForm(issue) {
  // Clear form
  document.getElementById('edit-issue-id').value = (issue) ? issue.issue_id : "";
  document.getElementById('edit-issue-userid').value = (issue && issue.userId) ? issue.userId : "";
  document.getElementById('edit-issue-title').value = (issue) ? issue.title : "";
  document.getElementById('edit-issue-duedate').value = (issue) ? issue.due_date : "";
  document.getElementById('edit-issue-priority').value = (issue) ? issue.priority : "";
  document.getElementById('edit-issue-body').value = (issue) ? issue.fullDescription : "";
  document.getElementById('project-dropdown-container').value = "";
  document.getElementById('project-dropdown-container').innerHTML = "";

  const labelDropdown = document.getElementById('edit-issue-labels');
  if (issue) {
    for (let i = 0; i < labelDropdown.length; i++) {
      if (labelDropdown.options[i].text === issue.label) {
        labelDropdown.selectedIndex = i;
        break;
      }
    }
  }
  else {
    labelDropdown.value = "";
  }

  const issue_state_id = document.getElementById('edit-issue-stateid');

  if (issue) {
    switch (issue.status) {
      case "In Progress":
        issue_state_id.value = 2;
        break;
      case "Blocked":
        issue_state_id.value = 3;
        break;
      case "Closed":
        issue_state_id.value = 4;
        break;
      default:
        issue_state_id.value = 1;
    }
  }
}

// Edit  issue handler
async function editIssue(event) {
  event.preventDefault();

  // Get form values to pass as object
  const id = document.getElementById('edit-issue-id').value;
  const title = document.getElementById('edit-issue-title').value;
  const dueDate = document.getElementById('edit-issue-duedate').value;
  const priority = document.getElementById('edit-issue-priority').value;
  const label = document.getElementById('edit-issue-labels').value;
  const description = document.getElementById('edit-issue-body').value;
  const projectId = document.getElementById('project-dropdown').value;
  const issueStateId = document.getElementById('edit-issue-stateid').value;

  // check if minimum values are provided
  if (projectId && title && description && dueDate && priority && label) {

    const data = {
      title: title,
      body: description
    }

    if (label !== "no-label" && label) {
      data.labels = [label];
    }

    let postBody = {
      due_date: dueDate,
      priority: priority,
      issueState_id: issueStateId, // set to current state
      project_id: projectId,
      data: data
    };

    // Post data to /api/project/ route
    const response = await fetch(`/api/issue/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      document.location.replace('/dashboard/')
    } else {
      alert(response.statusText);
    }

    // Close modal
    $('#edit-issue-modal').modal('hide');
    clearEditIssueForm(null);

  } else {
    alert('Missing information.');
  }
}

// Return list of projects for dropdown
async function openEditIssueModal(issue) {
  // Clear current form
  clearEditIssueForm(issue);

  await fetch('/api/project')
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          let editIssueFormEl = document.getElementById('project-edit-dropdown-container');
          editIssueFormEl.innerHTML = "";

          // Create a dom select element for project dropdown
          let projectDDEl = document.createElement('select');
          projectDDEl.classList.add("form-control");
          projectDDEl.id = "project-dropdown";
          projectDDEl.name = "project-dropdown";

          // Include blank option
          var optionDefault = document.createElement("option");
          optionDefault.text = "Select a project..."
          projectDDEl.add(optionDefault);

          // Loop through returned projects and create an option for each
          for (let i = 0; i < data.length; i++) {
            var option = document.createElement("option");
            option.text = data[i].name;
            option.value = data[i].id;
            if (data[i].id === issue.project_id) {
              option.setAttribute("selected", "true");
            }

            // Add option to the project select element
            projectDDEl.add(option);
          }

          // Append the selected element to the container
          editIssueFormEl.appendChild(projectDDEl);
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

document.getElementById('edit-issue-form').addEventListener('submit', editIssue);