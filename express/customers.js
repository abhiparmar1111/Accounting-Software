document.addEventListener('DOMContentLoaded', function () {
    fetch('/customers')
        .then(response => response.json())
        .then(data => {
            let customerTable = $('#customerTable').DataTable({
                data: data,
                columns: [
                    { data: null },
                    { data: 'customerName' },
                    { data: 'city' },
                    { data: 'state' },
                    { data: 'balance' },
                    { data: 'gst' },
                    { data: 'pan' },
                    {
                        data: null, render: function (data, type, row) {
                            return `
                            <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
                            <button class="btn btn-info btn-sm view-btn" data-id="${row.id}">View</button>
                        `;
                        }
                    }
                ],
                columnDefs: [{
                    targets: 0,
                    render: function (data, type, row, meta) {
                        return meta.row + 1; 
                    }
                }]
            });

            var addcus = document.getElementById("addCustomer");
            addcus.onclick = function () {
                window.location.href = "create-customer.html";
            }

            $('#customerTable').on('click', '.edit-btn', function () {
                let customerId = $(this).data('id');

                fetch(`/get_customer/${customerId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            $('#editCustomerId').val(data.id);
                            $('#editCustomerName').val(data.customerName);
                            $('#editLegalName').val(data.legalName);
                            $('#editmobile').val(data.mobile);
                            $('#editcontactPerson').val(data.contactPerson);
                            $('#editemail').val(data.email);
                            $('#editaddress1').val(data.address1);
                            $('#editaddress2').val(data.address2);
                            $('#editcity').val(data.city);
                            $('#editstate').val(data.state);
                            $('#editstateCode').val(data.stateCode);
                            $('#editpincode').val(data.pincode);
                            $('#editgst').val(data.gst);
                            $('#editpan').val(data.pan);
                            $('#editremark').val(data.remark);
                            $('#editbankName').val(data.bankName);
                            $('#editaccountNo').val(data.accountNo);
                            $('#editifsc').val(data.ifscCode);
                            $('#editbalance').val(data.balance);

                            $('#editCustomerModal').modal('show');
                        } else {
                            console.error("Error: No customer data found");
                            alert("Error: No customer data found");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching customer data: ", error);
                        alert("Error fetching customer data");
                    });
            });

            $('#editCustomerForm').on('submit', function(event) {
                event.preventDefault(); 

                let customerId = $('#editCustomerId').val();
                let updatedCustomerData = {
                    customerName: $('#editCustomerName').val(),
                    legalName: $('#editLegalName').val(),
                    mobile: $('#editmobile').val(),
                    contactPerson: $('#editcontactPerson').val(),
                    email: $('#editemail').val(),
                    address1: $('#editaddress1').val(),
                    address2: $('#editaddress2').val(),
                    city: $('#editcity').val(),
                    state: $('#editstate').val(),
                    stateCode: $('#editstateCode').val(),
                    pincode: $('#editpincode').val(),
                    gst: $('#editgst').val(),
                    pan: $('#editpan').val(),
                    remark: $('#editremark').val(),
                    bankName: $('#editbankName').val(),
                    accountNo: $('#editaccountNo').val(),
                    ifscCode: $('#editifsc').val(),
                    balance: $('#editbalance').val()
                };

                console.log('Updated Customer Data:', updatedCustomerData); 

                fetch(`/edit_customer/${customerId}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedCustomerData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Customer updated successfully');
                        $('#editCustomerModal').modal('hide');
                        location.reload();
                    } else {
                        alert('Error updating customer: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error updating customer');
                });
            });

            $('#customerTable').on('click', '.delete-btn', function () {
                deleteCustomerId = $(this).data('id');
                $('#deleteConfirmationModal').modal('show');
            });

            $('#cancelDelete').on('click', function(){
                $('#deleteConfirmationModal').modal('hide');
            });

            $('#confirmDelete').on('click', function () {
                $('#deleteConfirmationModal').modal('hide');
                if (deleteCustomerId) {
                    fetch(`/delete_customer/${deleteCustomerId}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Customer deleted successfully');
                            location.reload();
                        } else {
                            alert('Error deleting customer: ' + data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error deleting customer');
                    });
                }
            });


            $('#customerTable').on('click', '.view-btn', function () {
                let customerId = $(this).data('id');
                fetch(`/get_customer/${customerId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data) {
                            document.getElementById('viewCustomerName').value = data.customerName;
                            document.getElementById('viewMobile').value = data.mobile;
                            document.getElementById('viewEmail').value = data.email;
                            document.getElementById('viewAddress1').value = data.address1;
                            document.getElementById('viewCity').value = data.city;
                            document.getElementById('viewState').value = data.state;
                            document.getElementById('viewStateCode').value = data.stateCode;
                            document.getElementById('viewPincode').value = data.pincode;
                            document.getElementById('viewGst').value = data.gst;
                            document.getElementById('viewPan').value = data.pan;
                            document.getElementById('viewBankName').value = data.bankName;
                            document.getElementById('viewAccountNo').value = data.accountNo;
                            document.getElementById('viewIfsc').value = data.ifscCode;
                            document.getElementById('viewBalance').value = data.balance;
            
                            $('#viewCustomerModal').modal('show'); // Show the modal
                        } else {
                            console.error("Error: No customer data found");
                            alert("Error: No customer data found");
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                        alert('Error: Unable to fetch customer data');
                    });
            });
            
        })
        .catch(error => {
            console.error("Error fetching customer list: ", error);
            alert("Error fetching customer list");
        });   
    })
