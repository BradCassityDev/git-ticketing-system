async function newTicketHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="title"]').value;
  const phone = document.querySelector('input[name="phone"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const description = document.querySelector('textarea[name="description"]').value;

  const response = await fetch(`/api/ticket`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      phone,
      email,
      description
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('#create-ticket-btn').addEventListener('click', newTicketHandler);
