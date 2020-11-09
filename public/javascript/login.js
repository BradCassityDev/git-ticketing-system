async function loginFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();
  let message = document.querySelector('#message');

  if (username && password) {
    const response = await fetch('/api/user/login', {
      method: 'post',
      body: JSON.stringify({
        username,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace(response.url);
    } else if (response.status === 400) {
      message.innerHTML = "Invalid Credentials";
    } else {
      message.innerHTML = response.statusText;
    }
  }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);