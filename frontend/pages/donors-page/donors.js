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
    document.getElementById('donate-button').addEventListener('click', () => {
        alert('Redirecting to donation form...');
        window.location.href = '../../partials/hostel-registration.html';
    });
});

