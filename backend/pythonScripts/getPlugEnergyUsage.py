from PyP100 import PyP110  # Import P110 class
import sys
import json
from dotenv import load_dotenv
import os
import time

# Load environment variables from .env file
load_dotenv()

# Retrieve the sensitive information from environment variables
ip_address = os.getenv("IP_ADDRESS")  
email = os.getenv("EMAIL")  
password = os.getenv("PASSWORD")  

if not ip_address or not email or not password:
    sys.stderr.write("Error: Missing required configuration in .env file.\n")
    sys.exit(1)

# Initialize P110 plug connection
sys.stderr.write("Initializing P110 plug connection...\n")

p110 = PyP110.P110(ip_address, email, password)

for attempt in range(3):
    try:
        # Perform handshake
        sys.stderr.write("Performing handshake...\n")
        p110.handshake()
        sys.stderr.write("Handshake completed.\n")

        # Login to the plug
        sys.stderr.write("Logging in to the plug...\n")
        p110.login()
        sys.stderr.write("Login successful.\n")
        break
    except Exception as e:
        sys.stderr.write(f"Failed to initialize plug connection. Attempt {attempt + 1}/3\n")
        if attempt < 2:
            sys.stderr.write("Retrying in 5 seconds...\n")
            time.sleep(5)
        else:
            sys.stderr.write("Failed to initialize plug connection after 3 attempts.\n")
            sys.exit(1)

# Get energy usage
sys.stderr.write("Fetching energy usage...\n")
energy_usage = p110.getEnergyUsage()

if energy_usage:
    sys.stderr.write("Energy usage retrieved successfully.\n")
    print(json.dumps(energy_usage))  # Only print JSON to stdout
    sys.stdout.flush()
else:
    sys.stderr.write("Failed to retrieve energy usage.\n")
    sys.exit(1)
