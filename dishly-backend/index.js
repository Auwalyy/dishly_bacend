 const express = require('express');
 const mongoose = require('mongoose');
 const dotenv = require('dotenv');
 const cors = require('cors');

 dotenv

 const app = express();


 app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({ error: 'Something went wrong!' });
 });



 //server
 const PORT = 5000;
 app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
 });