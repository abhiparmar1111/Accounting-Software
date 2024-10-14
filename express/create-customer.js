document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    const createCustomerForm = document.getElementById('createCustomerForm');
    const customerform = document.getElementById('customerform');

    customerform.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(customerform);
        const customerData = Object.fromEntries(formData.entries());

        fetch('/create-customer', {
            method: "POST",
            body: JSON.stringify(customerData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Customer created successfully');
                window.location.href = "customer-list.html";
            } else {
                alert('Error creating customer: ' + data.error);
            }
        })
        .catch(error => {
            console.log("Error: ", error);
            alert("Error creating customer");
        });
    });
});