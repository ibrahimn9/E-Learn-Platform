# Setting Up an Express App for E-Learning platform

## Prerequisites
- Node.js installed on your system


## Installation

1. Clone the repository From:
    ```bash
    git clone https://github.com/ibrahimn9/E-Learn-Platform.git
    ```

2. Navigate to the project directory:
    ```bash
    cd back-end
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1. Set up your environment variables:
    - Create a `.env` file in the root directory.
    - Define environment variables such as database connection details, API keys, etc.

    Example `.env` file:
    ```
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=elearning_db
    ```

2. Set up your database:
    - Create a database with the name specified in your `.env` file.
    - Run any database migrations or seed data scripts if needed.

## Running the Server

To start the Express server, run the following command:
```bash
npm run start
```