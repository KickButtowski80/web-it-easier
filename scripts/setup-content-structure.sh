#!/bin/bash

echo "Creating content directory..."
mkdir -p content
if [ $? -ne 0 ]; then
    echo "Error creating content directory"
    exit 1
fi

echo "Directory created!"
echo "Creating calendar directory..."
mkdir -p content/calendar
if [ $? -ne 0 ]; then
    echo "Error creating calendar directory"
    exit 1
fi

echo "Calendar directory created!"

echo "Creating 2025 directory..."
mkdir -p content/calendar/2025
if [ $? -ne 0 ]; then
    echo "Error creating 2025 directory"
    exit 1
fi

echo "Creating template.md..."
touch content/calendar/2025/template.md
if [ $? -ne 0 ]; then
    echo "Error creating template.md"
    exit 1
fi

echo "All directories created successfully!"
