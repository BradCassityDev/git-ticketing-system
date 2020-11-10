// Create new issue handler
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

  if (response.ok) {
    console.log(response);

    //document.location.replace('/dashboard/')
  } else {
    alert(response.statusText);
  }
}