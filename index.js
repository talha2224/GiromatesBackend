const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {ErrorResponse, catchAsync} = require('./Error/Utils');
const { dbConnection } = require('./Database/connection');
// const { NotificationModel } = require('./Models');
const app = express()
app.use(express.json())
app.use(cors({origin:"*"}))


// DB COONECTION
dbConnection()

// MULTER IMAGE
app.use('/userImage',express.static('./userImage'))
app.use('/coverImage',express.static('./coverImage'))
app.use('/eventImage',express.static('./eventImage'))
app.use('/postimage',express.static('./postimage'))
// PORT NUMBER
let port = process.env.PORT || 4000


// API ROUTES 

app.use('/api/v1/user',require('./Routes/Account/account'))

app.use('/api/v1/inspired/post', require('./Routes/InspiredPost/post'))

app.use('/api/v1/event',require('./Routes/Events/eventsRoutes'))

app.use('/api/v1/notification',require('./Routes/Notification/notificationRoute'))



// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ErrorResponse("API Not found", 404));
});

// const deleteNotification = async ()=>{
//     await  NotificationModel.deleteMany({})
// }
// deleteNotification()


//CUSTOM ERROR HANDLING
app.use(require("./Error/Error"));

// PORT LISTEN
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})