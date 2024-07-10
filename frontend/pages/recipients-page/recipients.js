document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register-button').addEventListener('click', () => {
        alert('Redirecting to donation form...');
        window.location.href = '../../partials/agency-registration.html';
    });
    
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Retrieved user:', user);

    if (user && user.Username) {
        const joinLink = document.getElementById('join-link');
        joinLink.innerHTML = `<a href="#">${user.Username}</a>`;
    } else {
        console.log('No user found in localStorage.');
    }
});


