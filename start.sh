#!/bin/bash
echo "--- Starting cleaning-task.py ---"
python3 /app/cleaning-task.py &
echo "--- Starting main.py ---"
python3 /app/main.py
echo "--- All scripts started successfully! ---"
