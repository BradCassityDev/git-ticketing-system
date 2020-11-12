// Clear form
function clearCreateUserForm() {
    // Clear form
    document.getElementById('create-user-username').value = '';
    document.getElementById('create-user-email').value = '';
    document.getElementById('create-user-phone').value = '';
    document.getElementById('create-user-password').value = '';
}
  
// Create new issue handler
async function createUser(event) {
    event.preventDefault();

    // Get form values to pass as object
    const username = document.getElementById('create-user-username').value;
    const email = document.getElementById('create-user-email').value;
    const phone = document.getElementById('create-user-phone').value;
    const password = document.getElementById('create-user-password').value;
    // check if minimum values are provided
    if(username) {

        // Post data to /api/user/ route 
        const response = await fetch(`/api/user/`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                email: email,
                phone: phone,
                password: password,
                user_state_id: 1
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log(response);
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    } else {
        alert('Missing information.');
    }
    // Close modal
    $('#create-user-modal').modal('hide');
    clearCreateUserForm();
}

// Create Project Submit Listener
document.getElementById('create-user-form').addEventListener('submit', createUser);
 
