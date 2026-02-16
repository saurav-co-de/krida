# MongoDB Setup Guide for KRIDA

This guide provides step-by-step instructions for setting up MongoDB for the KRIDA Sports Hub application.

## Option 1: Local MongoDB (Recommended for Development)

1.  **Download**: Go to the [MongoDB Community Server Download](https://www.mongodb.com/try/download/community) page.
2.  **Install**: Follow the installation wizard with default settings.
3.  **Start Service**: 
    - **Windows**: MongoDB usually starts as a service automatically. You can check in `Services.msc`.
    - **macOS**: Use Homebrew: `brew services start mongodb-community`.
4.  **URI**: Your local connection string will be: `mongodb://localhost:27017/krida`.

## Option 2: MongoDB Atlas (Cloud Database)

1.  **Register**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  **Create Cluster**: Follow the free tier cluster creation process (Shared Cluster).
3.  **Database User**: Create a database user with read/write access.
4.  **Network Access**: Add your IP address to the whitelist (Access from Anywhere `0.0.0.0/0` is also an option for testing).
5.  **Connection String**: Click "Connect" -> "Connect your application" and copy the URI.
6.  **URI**: It will look like: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/krida?retryWrites=true&w=majority`.

## Application Configuration

Once MongoDB is running:

1.  Navigate to the `backend` directory.
2.  Create a `.env` file (or copy from `.env.example`).
3.  Set your connection string:
    ```env
    MONGODB_URI=mongodb://localhost:27017/krida
    ```
4.  **Seed the Database**: Run the following command to populate initial turf data:
    ```bash
    npm run seed
    ```

## Tools for Management

-   **MongoDB Compass**: A powerful GUI for interacting with your data. Download it [here](https://www.mongodb.com/try/download/compass).
-   **mongosh**: The MongoDB Shell (CLI tool).
