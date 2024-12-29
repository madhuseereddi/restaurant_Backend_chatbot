const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Create and connect to SQLite database
const db = new sqlite3.Database('./orders.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// Create the orders table with an order_status field
const createTableQuery = `
CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,  -- Using TEXT for order_id to accept any data type (string, number)
    name TEXT NOT NULL,         -- TEXT to store the name
    mobile TEXT NOT NULL,       -- TEXT to store the mobile number
    email TEXT NOT NULL,        -- TEXT to store the email
    ordered_items TEXT NOT NULL, -- TEXT to store ordered items (can be JSON or plain string)
    feedback_rating TEXT DEFAULT '0', -- TEXT to store feedback rating (can be string or number)
    order_status TEXT DEFAULT 'Pending',  
    address TEXT DEFAULT NULL
);
`;


db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
        return;
    }
    console.log('Orders table created successfully (if it did not already exist).');
});




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreply.bingdy@gmail.com',
      pass: 'yxsm etbk nrpb yqcv', // Replace with your App Password (not regular Gmail password)
    },
    tls: {
      rejectUnauthorized: false,
    },
    port: 587,
    host: 'smtp.gmail.com',
  });
  
  function sendEmail(order) {
    const { order_id, name, email, mobile, ordered_items } = order;

    const mailOptions = {
        from: 'noreply.bingdy@gmail.com',
        to: email,
        subject: 'Your Order Confirmation - Address Needed',
        html: `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(90deg, #323cf0, #c213f2);
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header img {
            width: 100px;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content1 {
            padding: 20px;
            background-color :rgba(194, 19, 242, 0.24);
            border-radius : 10px;
        }
        .content{
           padding : 10px;
        }
        .content h2 {
            color: #323cf0;
            margin-bottom: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .content .highlight {
            font-weight: bold;
            color: #c213f2;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            color:  #c213f2;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        .footer {
            background-color: #f1f1f1;
            color: #666666;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
        table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            border-radius : 10px;
        }
        table th, table td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ccc;
        }
        table th {
            background-color: #323cf0;
            color: #ffffff;
        }
        table td {
            background-color: #f9f9f9;
        }
        .instructions {
            margin-top: 20px;
            padding: 10px;
            background-color: #fef3c7;
            color: #856404;
            border-left: 6px solid #ffecb5;
            border-radius: 4px;
        }
        #bingdy {
            width: 60px;
            height : 60px;
            filter: brightness(1.5); /* Increases brightness by 50% */
        }
        .button-1{
            background-color:rgba(194, 19, 242, 0.35);
        }
        .warning {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff3cd;
            border-left: 6px solid #ffecb5;
            color: #856404;
            font-size: 14px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/dx97khgxd/image/upload/v1734184584/IMG_20241214_184502.png_mobdtx.png" alt="Bingdy Logo" id="bingdy">
            <h1>Confirm Your Address</h1>
        </div>
        <div class="content">
            <h2>Hello, <span class="highlight">${name}</span>!</h2>
            <p>We have received your order and need your address to proceed with the shipment.</p>
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> <span class="highlight">${order_id}</span></p>
            <p><strong>Name:</strong> <span class="highlight">${name}</span></p>
            <p><strong>Mobile:</strong> <span class="highlight">${mobile}</span></p>
            <p><strong>Email:</strong> <span class="highlight">${email}</span></p>
            
            <table>
                <tr>
                    <th>Food And Category</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
                ${ordered_items.map(item => ` 
                    <tr>
                        <td>${item['Food And Category']}</td>
                        <td>${item.Description}</td>
                        <td>${item['Item Price']}</td>
                        <td>${item.count}</td>
                    </tr>
                `).join('')}
                <tr>
                    <td colspan="3" style="text-align: right; font-weight: bold;">Total Amount:</td>
                    <td>₹${ordered_items.reduce((total, item) => total + Number(item['Item Price'].replace('₹', '')) * item.count, 0)}</td>
                </tr>
            </table>
            <br/>
            <div class="content1">
                <p>We have received your order and need your address to proceed with the shipment.</p>
                <a href="http://localhost:3000/enter-address?order_id=${order_id}" class="button-1">Click here and enter your Address</a>
            </div>

            <div class="warning">
                <strong>Important:</strong> Please note that once the shipment has started, cancellation is no longer possible. Ensure your address is correct to avoid delays.
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2024 Bingdy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`
                };

    // Sending the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
}

app.post('/submit-address', (req, res) => {
    const { address, order_id } = req.body;

    // Validate input data
    if (!address || address.trim() === "") {
        return res.status(400).json({ message: 'Address is required.' });
    }

    if (!order_id) {
        return res.status(400).json({ message: 'Order ID is required.' });
    }

    // Update the address for the given order_id in the database
    const updateQuery = `UPDATE orders SET address = ? WHERE order_id = ?`;

    db.run(updateQuery, [address, order_id], function (err) {
        if (err) {
            console.error('Error updating address:', err.message);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (this.changes === 0) {
            // If no rows are updated, it means the order_id was not found
            return res.status(404).json({ message: 'Order ID not found.' });
        }

        console.log(`Updated address: ${address} for order ID: ${order_id}`);
        res.status(200).json({ message: 'Address updated successfully.' });
        
    });
});

app.get('/enter-address', (req, res) => {
    const { order_id } = req.query; // Retrieving the order_id from query string
    res.send(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Enter Address</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .form-container {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 400px;
                }
                input[type="text"] {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #323cf0;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #c213f2;
                }
                h2 {
                    color: #323cf0;
                    margin-bottom: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="form-container">
                <h2>Enter Your Address</h2>
                <form action="/submit-address" method="POST">
                    <input type="hidden" name="order_id" value="${order_id}">
                    <input type="text" name="address" placeholder="Enter your full address" required>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </body>
        </html>
    `);
});


app.post('/send-mail', (req, res) => {
    const { order_id , name , mobile , email, ordered_items} = req.body;

   const order = {
    order_id,
    name,
    mobile,
    email,
    ordered_items
   }
    // Call the sendEmail function
    sendEmail(order);

    // Respond to the client
    res.status(200).send({ message: 'Email sent successfully!' });
});




// API endpoint to add a new order
app.post('/add-order', (req, res) => {
    const { order_id, name, mobile, email, ordered_items, order_status } = req.body;

    if (!order_id || !name || !mobile || !email || !ordered_items) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    const insertQuery = `
    INSERT INTO orders (order_id, name, mobile, email, ordered_items, feedback_rating, order_status, address)
    VALUES (?, ?, ?, ?, ?, ?, ?,?);
    `;

    db.run(
        insertQuery,
        [order_id, name, mobile, email, JSON.stringify(ordered_items), 0, order_status || 'Pending', "null"],  // Default to 'Pending' if not provided
        function (err) {
            if (err) {
                console.error('Error inserting order:', err.message);
                return res.status(500).send({ error: 'Failed to add order.' });
            }
            res.status(201).send({ message: 'Order added successfully!', orderId: this.lastID });
        }
    );
});

// API endpoint to fetch all orders
app.get('/orders', (req, res) => {
    const selectQuery = 'SELECT * FROM orders';
    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            return res.status(500).send({ error: 'Failed to fetch orders.' });
        }
        res.send(rows);
    });
});

// API endpoint to fetch a specific order by order_id or email
app.get('/order', (req, res) => {
    const { order_id, email } = req.query;

    if (!order_id && !email) {
        return res.status(400).send({ error: 'Please provide either order_id or email.' });
    }

    const selectQuery = order_id
        ? 'SELECT * FROM orders WHERE order_id = ?'
        : 'SELECT * FROM orders WHERE email = ?';
    const param = order_id || email;

    db.get(selectQuery, [param], (err, row) => {
        if (err) {
            console.error('Error fetching order:', err.message);
            return res.status(500).send({ error: 'Failed to fetch order.' });
        }
        if (!row) {
            return res.status(404).send({ error: 'Order not found.' });
        }
        res.send(row);
    });
});

// API endpoint to update feedback for an order by order_id
app.put('/update-feedback', (req, res) => {
    const { order_id, feedback_rating } = req.body;

    if (!order_id) {
        return res.status(400).send({ error: 'Order ID is required.' });
    }

    if (feedback_rating === undefined) {
        return res.status(400).send({ error: 'Feedback rating is required.' });
    }

    // Extract the number part before the "_"
    const numericRating = parseInt(feedback_rating.split('_')[0]);
    // Validate feedback rating range (e.g., between 1 and 5)
    if (numericRating < 1 || numericRating > 5) {
        return res.status(400).send({ error: 'Feedback rating must be between 1 and 5.' });
    }

    const updateQuery = `
        UPDATE orders
        SET feedback_rating = ?
        WHERE order_id = ?;
    `;

    db.run(
        updateQuery,
        [numericRating, order_id],
        function (err) {
            if (err) {
                console.error('Error updating feedback:', err.message);
                return res.status(500).send({ error: 'Failed to update feedback.' });
            }

            if (this.changes === 0) {
                return res.status(404).send({ error: 'Order not found.' });
            }

            res.send({
                message: 'Feedback updated successfully!',
                updatedOrderId: order_id,
                updatedFeedbackRating: numericRating
            });
        }
    );
});

// API endpoint to update the order status by order_id
app.put('/update-order-status', (req, res) => {
    const { order_id, order_status } = req.body;

    if (!order_id) {
        return res.status(400).send({ error: 'Order ID is required.' });
    }

    if (!order_status) {
        return res.status(400).send({ error: 'Order status is required.' });
    }

    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(order_status)) {
        return res.status(400).send({ error: 'Invalid order status.' });
    }

    const updateQuery = `
        UPDATE orders
        SET order_status = ?
        WHERE order_id = ?;
    `;

    db.run(
        updateQuery,
        [order_status, order_id],
        function (err) {
            if (err) {
                console.error('Error updating order status:', err.message);
                return res.status(500).send({ error: 'Failed to update order status.' });
            }

            if (this.changes === 0) {
                return res.status(404).send({ error: 'Order not found.' });
            }

            res.send({
                message: 'Order status updated successfully!',
                updatedOrderId: order_id,
                updatedOrderStatus: order_status
            });
        }
    );
});
// API endpoint to delete an order by order_id
app.delete('/delete-order', (req, res) => {
    const { order_id } = req.body;

    if (!order_id) {
        return res.status(400).send({ error: 'Order ID is required.' });
    }

    const deleteQuery = `DELETE FROM orders WHERE order_id = ?`;

    db.run(deleteQuery, [order_id], function (err) {
        if (err) {
            console.error('Error deleting order:', err.message);
            return res.status(500).send({ error: 'Failed to delete order.' });
        }

        if (this.changes === 0) {
            return res.status(404).send({ error: 'Order not found.' });
        }

        res.send({
            message: 'Order deleted successfully!',
            deletedOrderId: order_id
        });
    });
});

// API endpoint to close the server and database
app.get('/close', (req, res) => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
            return res.status(500).send({ error: 'Failed to close database.' });
        }
        console.log('Database connection closed.');
        res.send({ message: 'Database connection closed.' });
        process.exit(0);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
