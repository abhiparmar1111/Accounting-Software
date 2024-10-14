document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    if (customerId) {
        fetch(`/get_customer/${customerId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    document.getElementById('viewCustomerName').textContent = data.customerName;
                    document.getElementById('viewMobile').textContent = data.mobile;
                    document.getElementById('viewEmail').textContent = data.email;
                    document.getElementById('viewAddress1').textContent = data.address1;
                    document.getElementById('viewCity').textContent = data.city;
                    document.getElementById('viewState').textContent = data.state;
                    document.getElementById('viewPincode').textContent = data.pincode;
                    document.getElementById('viewGst').textContent = data.gst;
                    document.getElementById('viewPan').textContent = data.pan;
                    document.getElementById('viewBankName').textContent = data.bankName;
                    document.getElementById('viewAccountNo').textContent = data.accountNo;
                    document.getElementById('viewIfsc').textContent = data.ifscCode;
                    document.getElementById('viewBalance').textContent = data.balance; 
                } else {
                    console.error("Error: No customer data found");
                    alert("Error: No customer data found");
                }
            })
            .catch(error => {
                console.error("Error fetching customer data: ", error);
                alert("Error fetching customer data");
            });
    } else {
        alert('No customer ID provided');
    }
});
