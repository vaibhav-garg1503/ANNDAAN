document.getElementById('donation-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = document.getElementById('donation-form');
    const formData = new FormData(form);
    // Retrieve user object from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Extract username from user object
    const username = user.Username;

    // Append username to formData or send in headers
    formData.append('username', username);

    try {
        const response = await fetch('http://localhost:3000/submit-donation', {
            method: 'POST',
            body: formData
        });

        console.log('Response status:', response.status); // Log the status code
        const data = await response.json(); // Parse the JSON response
        console.log('Response data:', data);

        if (response.ok) {
            alert(data.message);
            form.reset();
        } else {
            alert('Error submitting donation' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting donation');
    }
});
