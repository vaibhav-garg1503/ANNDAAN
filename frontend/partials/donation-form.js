document.getElementById('donation-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const form = document.getElementById('donation-form');
    const formData = new FormData(form);

    // Retrieve user object from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.Username) {
        console.error('User information missing or invalid.');
        alert('User information missing or invalid.');
        return;
    }

    // Extract username from user object
    const username = user.Username;

    // Append username to formData
    formData.append('username', username);

    try {
        const response = await fetch('http://localhost:3000/submit-donation', {
            method: 'POST',
            body: formData
        });

        console.log('Response status:', response.status); // Log the status code

        if (response.status >= 200 && response.status < 300) {
            console.log('Response status:', response.status);
            const data = await response.json(); // Parse the JSON response
            alert(data.message); // Show success message
            form.reset(); // Reset the form on successful submission
        } else {
            const data = await response.json(); // Parse the JSON error response
            alert('Error submitting donation: ' + data.error); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting donation');
    }
});
