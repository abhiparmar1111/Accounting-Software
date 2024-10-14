document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    console.log("inside login js");

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.username.value,
            password: form.password.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("succes...")
            window.location.href = 'index.html';    
        } else {
            document.getElementById('message').innerText = data.message;
        }
    })
    .catch(error => {
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
        console.error('Error:', error);
    });
});