document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    fetch(`/get_customer/${customerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Changed from json() to text() to handle potential empty response 
        })
        .then(data => {
            if (data) {
                const customerData = JSON.parse(data);
                document.getElementById('customerId').value = customerData.id;
                document.getElementById('editCustomerName').value = customerData.customerName;
                document.getElementById('editLegalName').value = customerData.legalName;
                document.getElementById('editmobile').value = customerData.mobile;
                document.getElementById('editcontactPerson').value = customerData.contactPerson;
                document.getElementById('editemail').value = customerData.email;
                document.getElementById('editaddress1').value = customerData.address1;
                document.getElementById('editaddress2').value = customerData.address2;
                document.getElementById('editcity').value = customerData.city;
                document.getElementById('editstate').value = customerData.state;
                document.getElementById('editstateCode').value = customerData.stateCode;
                document.getElementById('editpincode').value = customerData.pincode;
                document.getElementById('editgst').value = customerData.gst;
                document.getElementById('editpan').value = customerData.pan;
                document.getElementById('editremark').value = customerData.remark;
                document.getElementById('editbankName').value = customerData.bankName;
                document.getElementById('editaccountNo').value = customerData.accountNo;
                document.getElementById('editifsc').value = customerData.ifscCode;
                document.getElementById('editbalance').value = customerData.balance;
            } else {
                console.error("Error: No customer data found");
                alert("Error: No customer data found");
            }
        })
        .catch(error => {
            console.error("Error fetching customer data: ", error);
            alert("Error fetching customer data");
        });

    document.getElementById('editCustomerForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const customerData = Object.fromEntries(formData.entries());

        fetch(`/edit_customer/${customerData.customerId}`, {
            method: 'PUT',
            body: JSON.stringify(customerData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Customer updated successfully');
                    window.location.href = '/dashboard.html';
                } else {
                    alert('Error updating customer: ' + data.error);
                }
            })
            .catch(error => {
                console.error("Error: ", error);
                alert("Error updating customer");
            });
    });
});
