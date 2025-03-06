# control_plug.py
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
    print("Error: Missing required configuration in .env file.")
    sys.exit(1)

power_state = sys.argv[1]  # 'on' or 'off'

print("Initializing P110 plug connection...")  

p110 = PyP110.P110(ip_address, email, password)

# Retry logic
max_retries = 3
retry_delay = 30 # seconds

for attempt in range(max_retries):
    try:
        # Perform handshake
        print("Performing handshake...")
        p110.handshake()
        print("Handshake completed.")

        # Login to the plug
        print("Logging in to the plug...")
        p110.login()
        print("Login successful.")
        break
    except Exception as e:
        print(f"Failed to initialize plug connection. Attempt {attempt + 1}/{max_retries}: {e}")
        if attempt < max_retries - 1:
            print(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            print("Failed to initialize plug connection after 3 attempts.")
            sys.exit(1)

if power_state == "on":
    print("Turning plug ON...") 
    p110.turnOn()
elif power_state == "off":
    print("Turning plug OFF...") 
    p110.turnOff()
else:
    print("Invalid power state argument. Use 'on' or 'off'.")
    sys.exit(1)

print(f"Plug state toggled to {power_state.upper()} successfully!")

