from PyP100 import PyP110  # Import P110 class
import time
import sys
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get environment variables
ip_address = os.getenv("IP_ADDRESS")  
email = os.getenv("EMAIL")  
password = os.getenv("PASSWORD")  

if not ip_address or not email or not password:
    sys.stderr.write("Error: Missing required configuration in .env file.\n")
    sys.exit(1)

power_state = sys.argv[1]  # 'on' or 'off'

sys.stderr.write("Initializing P110 plug connection...\n")

p110 = PyP110.P110(ip_address, email, password)

# Retry logic
max_retries = 3
retry_delay = 30  # seconds

for attempt in range(max_retries):
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
        sys.stderr.write(f"Failed to initialize plug connection. Attempt {attempt + 1}/{max_retries}: {e}\n")
        if attempt < max_retries - 1:
            sys.stderr.write(f"Retrying in {retry_delay} seconds...\n")
            time.sleep(retry_delay)
        else:
            sys.stderr.write("Failed to initialize plug connection after 3 attempts.\n")
            sys.exit(1)

if power_state == "on":
    sys.stderr.write("Turning plug ON...\n")
    p110.turnOn()
elif power_state == "off":
    sys.stderr.write("Turning plug OFF...\n")
    p110.turnOff()
else:
    sys.stderr.write("Invalid power state argument. Use 'on' or 'off'.\n")
    sys.exit(1)

sys.stderr.write(f"Plug state toggled to {power_state.upper()} successfully!\n")
