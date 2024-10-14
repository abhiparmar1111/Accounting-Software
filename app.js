const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');

const upload = multer();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Abhayraj@1111",
    database: "login_db"
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySQL connected...");
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM User WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error during query:", err);
            res.sendFile(path.join(__dirname, 'error-500.html'));
            return;
        }

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

app.post('/add_user', upload.none(), (req, res) => {
    const { fullName, username, email, password, confirmPassword, mobile } = req.body;

    if (password !== confirmPassword) {
        res.status(400).send("Passwords do not match");
        return;
    }

    const query = 'INSERT INTO User (fullname, username, email, password, mobile) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [fullName, username, email, password, mobile], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            res.sendFile(path.join(__dirname, 'error-500.html'));
            return;
        }
        res.send('New user added successfully');
    });
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM User';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.sendFile(path.join(__dirname, 'error-500.html'));
            return;
        }
        res.json(results);
    });
});

app.post('/edit_user/:id', (req, res) => {
    const { id } = req.params;
    const { fullname, username, email, mobile } = req.body;

    const query = 'UPDATE User SET fullname = ?, username = ?, email = ?, mobile= ? WHERE user_id = ?';
    db.query(query, [fullname, username, email, mobile, id], (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            res.sendFile(path.join(__dirname, 'error-500.html'));
            return;
        }
        res.send("Changes made successfully");
    });
});

app.delete('/delete_user/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM User WHERE user_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            res.sendFile(path.join(__dirname, 'error-500.html'));
            return;
        }
        res.send("Changes made successfully");
    });
});

app.post('/create-customer', (req, res) => {
    const customerData = req.body;

    const sql = `INSERT INTO customers (customerName, legalName, mobile, contactPerson, email, address1, address2, city, stateCode, state, pincode,
                 gst, pan, remark, bankName, accountNo, ifscCode, balance)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        customerData.customerName, customerData.legalName, customerData.mobile, customerData.contactPerson, customerData.email,
        customerData.address1, customerData.address2, customerData.city, customerData.stateCode, customerData.state, customerData.pincode, customerData.gst,
        customerData.pan, customerData.remark, customerData.bankName, customerData.accountNo, customerData.ifscCode, customerData.balance,
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        res.status(200).json({ success: true });
    });
});

app.get('/customers', (req, res) => {
    const query = "SELECT * FROM customers";
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        res.json(result);
    });
});

app.get('/edit-customer_page', (req, res) => {
    const { id } = req.params;
    const updatedCustomerData = req.body;

    const query = `UPDATE customers SET customerName = ?, legalName = ?, mobile = ?, contactPerson = ?, email = ?, address1 = ?, address2 = ?, city = ?, state = ?, stateCode = ?, pincode = ?, gst = ?, pan = ?, remark = ?, bankName = ?, accountNo = ?, ifscCode = ?, balance = ? WHERE id = ?`;
    const values = [updatedCustomerData.customerName, updatedCustomerData.legalName, updatedCustomerData.mobile, updatedCustomerData.contactPerson, updatedCustomerData.email, updatedCustomerData.address1, updatedCustomerData.address2, updatedCustomerData.city, updatedCustomerData.state, updatedCustomerData.pincode, updatedCustomerData.gst, updatedCustomerData.pan, updatedCustomerData.remark, updatedCustomerData.bankName, updatedCustomerData.accountNo, updatedCustomerData.ifscCode, updatedCustomerData.balance, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        res.status(200).json({ success: true });
    });
});

app.get('/get_customer/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM customers WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ success: false, error: 'Customer not found' });
            return;
        }
        res.json(result[0]);
    });
});

app.put('/edit_customer/:id', (req, res) => {
    const { id } = req.params;
    const updatedCustomerData = req.body;

    const query = `UPDATE customers SET customerName = ?, legalName = ?, mobile = ?, contactPerson = ?, email = ?, address1 = ?, address2 = ?, city = ?, state = ?, stateCode = ?, pincode = ?, gst = ?, pan = ?, remark = ?, bankName = ?, accountNo = ?, ifscCode = ?, balance = ? WHERE id = ?`;
    const values = [updatedCustomerData.customerName, updatedCustomerData.legalName, updatedCustomerData.mobile, updatedCustomerData.contactPerson, updatedCustomerData.email, updatedCustomerData.address1, updatedCustomerData.address2, updatedCustomerData.city, updatedCustomerData.state, updatedCustomerData.stateCode, updatedCustomerData.pincode, updatedCustomerData.gst, updatedCustomerData.pan, updatedCustomerData.remark, updatedCustomerData.bankName, updatedCustomerData.accountNo, updatedCustomerData.ifscCode, updatedCustomerData.balance, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        res.status(200).json({ success: true });
    });
});

app.delete('/delete_customer/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM customers WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting customer: ', err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        res.status(200).json({ success: true });
    });
});

app.get('/view_customer/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM customers WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Database error');
            return;
        }
        res.render('view_customer', { customer: result[0] });
    });
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
