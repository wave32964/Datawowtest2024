#!/bin/bash

# Set database username, password, and database name
DB_USER="natchapol"
DB_NAME="mydatabase"
DB_PASSWORD="your_postgres_password"  # Replace with your actual PostgreSQL password

# Export password to avoid password prompt
export PGPASSWORD=$DB_PASSWORD

# Run the SQL commands in the setup.sql file and check for errors
psql -U $DB_USER -d $DB_NAME -f setup.sql || { echo "Error running SQL file"; exit 1; }

# Unset the password variable for security
unset PGPASSWORD

echo "Database and table created successfully!"
