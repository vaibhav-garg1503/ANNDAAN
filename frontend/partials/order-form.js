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
                const row = donationsTable.insertRow();
                row.insertCell(0).innerText = donation.FoodItems;
                row.insertCell(1).innerText = donation.Quantity;
                const actionCell = row.insertCell(2);
                const orderButton = document.createElement('button');
                orderButton.innerText = 'Order';
                orderButton.onclick = () => addOrder(donation.FoodItem, donation.Quantity);
                actionCell.appendChild(orderButton);
            });
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    }

    async function addOrder(foodItem, quantity) {
        const recipientID = prompt('Enter your Recipient ID:');
        if (!recipientID) return;
        try {
            await axios.post('/api/orders', {
                RecipientID: recipientID,
                FoodItem: foodItem,
                Quantity: quantity
            });
            alert('Order placed successfully');
        } catch (error) {
            console.error('Error placing order:', error);
        }
    }
});
