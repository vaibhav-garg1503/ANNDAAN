document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register-button').addEventListener('click', () => {
        if (user && user.Username && user.Role === 'Recipient') {
            alert('Redirecting to order form...');
            window.location.href = '../../partials/order-form.html';
        } else if (user && user.Username && user.Role === 'Donor') {
            alert('You are not registered as a Recipient. Redirecting to donor dashboard...');
            window.location.href = '../donors-page/donors.html';
        } else {
            alert('Redirecting to registration form...');
            window.location.href = '../../partials/agency-registration.html';
        }
    });
    
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Retrieved user:', user);

    if (user && user.Username && user.Role === 'Recipient') {
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

        fetchOrders(user.Username);
  
      } else if (user && user.Username && user.Role === 'Donor'){
        console.log('User is a Donor.');
        displayNoOrdersMessage();
      }
      else {
        console.log('No user found in localStorage.');
        displayNoOrdersMessage();
      }
});

function fetchOrders(username) {
    axios.get(`http://localhost:3000/orders/${username}`)
        .then(response => {
            const orders = response.data.orders;
            populateOrdersTable(orders);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders. Please try again later.');
        });
}

function populateOrdersTable(orders) {
    const tableBody = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    if (orders.length === 0) {
        displayNoOrdersMessage();
    }
    else {
        orders.forEach(order => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = order.OrderID;
            row.insertCell(1).innerText = order.FoodItems;
            row.insertCell(2).innerText = order.Quantity;
            row.insertCell(3).innerText = new Date(order.OrderedAt).toLocaleString();
        });
    }
}

function displayNoOrdersMessage() {
    ordersTable.innerHTML = '<p class="no-orders-message">Receive your first donation now!</p>';
}


