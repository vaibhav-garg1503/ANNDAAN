document.addEventListener('DOMContentLoaded', () => {
    async function fetchDonors() {
        try {
          const response = await fetch('http://localhost:3000/donors'); // Replace with your backend API URL
          const data = await response.json();
          
          data.sort((a, b) => b.TotalDonations - a.TotalDonations);

          // Update UI with donor data
          const donorsList = document.getElementById('donors-list');
          if (!donorsList) {
            console.error('Element with id "donors-list" not found');
            return;
          }
          data.forEach(donor => {
            const listItem = document.createElement('li');
            listItem.textContent = `${donor.Username} donated ${donor.TotalDonations} pounds.`;
            donorsList.appendChild(listItem);
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    
    fetchDonors();

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


    document.getElementById('donate-button').addEventListener('click', () => {
      if (user && user.Username && user.Role === 'Donor') {
          alert('Redirecting to donation form...');
          window.location.href = '../../partials/donation-form.html';
      } else if(user && user.Username && user.Role === 'Recipient'){
        alert('You are not registered as a Donor. Redirecting to recipient dashboard...');
        window.location.href = '../recipients-page/recipients.html';
      }
      else {
          alert('Redirecting to registration form...');
          window.location.href = '../../partials/hostel-registration.html';
      }
  });
  
});

