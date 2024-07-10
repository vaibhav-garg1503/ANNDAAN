document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register-button').addEventListener('click', () => {
        if (user && user.Username) {
            alert('Redirecting to order form...');
            window.location.href = '../../partials/order-form.html';
        } else {
            alert('Redirecting to registration form...');
            window.location.href = '../../partials/agency-registration.html';
        }
    });
    
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Retrieved user:', user);

    if (user && user.Username) {
        const joinLink = document.getElementById('join-link');
        joinLink.innerHTML = `
        <div class="dropdown">
        <span id="user-dropdown" class="dropdown-toggle">${user.Username}</span>
        <div class="dropdown-menu" id="dropdown-menu">
            <a href="#" id="logout-link">Logout</a>
        </div>
        </div>
        `;
        
        // Function to toggle dropdown menu
        function toggleDropdown() {
            const dropdownMenu = document.getElementById('dropdown-menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        }
  
        // Event listener to toggle dropdown on click
        document.addEventListener('click', function(event) {
            const userDropdown = document.getElementById('user-dropdown');
            if (event.target === userDropdown) {
                toggleDropdown();
            } else {
                const dropdownMenu = document.getElementById('dropdown-menu');
                if (!dropdownMenu.contains(event.target)) {
                    dropdownMenu.style.display = 'none';
                }
            }
        });
  
        function logout() {
            localStorage.removeItem('user');
            window.location.href = '../../home/home.html'; 
        }
  
        document.getElementById('logout-link').addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Logout clicked');
            logout();
        });
  
      } else {
        console.log('No user found in localStorage.');
      }
});


