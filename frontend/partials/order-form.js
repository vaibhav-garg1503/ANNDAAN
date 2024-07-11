document.addEventListener('DOMContentLoaded', () => {
    fetchDonations();

    async function fetchDonations() {
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:3000',
        });
        try {
            const response = await axiosInstance.get('/donations');
            const donations = response.data;
            const donationsTable = document.getElementById('donationsTable').getElementsByTagName('tbody')[0];
            donations.forEach(donation => {
                let donatedAt = new Date(donation.DonatedAt);
                let options = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    timeZoneName: 'short',
                    timeZone: 'Asia/Kolkata'
                };
                let formattedDate = donatedAt.toLocaleString('en-GB', options);

                const row = donationsTable.insertRow();
                row.insertCell(0).innerText = donation.DonationID;
                row.insertCell(1).innerText = donation.FoodItems;
                row.insertCell(2).innerText = donation.Quantity;
                row.insertCell(3).innerText = formattedDate;
                const actionCell = row.insertCell(4);
                const orderButton = document.createElement('button');
                orderButton.innerText = 'Order';
                orderButton.onclick = () => addOrder(donation.DonationID,donation.FoodItems, donation.Quantity, row);
                actionCell.appendChild(orderButton);
            });
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    }

    function addOrder(donationID,foodItems, quantity, row) {
        const user = JSON.parse(localStorage.getItem('user'));
        const username = user.Username;

        if (!username) {
            alert('You must be logged in to place an order');
            return;
        }
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:3000',
        });

        axiosInstance.post('/order', {
            username: username,
            donationID: donationID,
            foodItems: foodItems,
            quantity: quantity
        })
        .then(response => {
            alert('Order placed successfully');
            row.remove();
        })
        .catch(error => {
            console.error('There was an error placing the order!', error);
            alert('There was an error placing the order');
        });
    }
});
