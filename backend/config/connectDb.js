import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDb = async () => {
    try {
        // Attempt to establish a connection using the connection string from environment variables
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);

        // Log a success message including the host details
        console.log("Connected to database:", connect.connection.host);
    } catch (err) {
        // Log the error if the connection fails
        console.log(err);

        // Exit the process with a failure code
        process.exit(1);
    }
};

export default connectDb; // Export the connection function as the default export
