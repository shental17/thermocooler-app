import os
import platform
import subprocess
import requests

# Function to ping the device
def ping_device(ip_address):
    # Determine the command based on the operating system
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    command = f"ping {param} 1 {ip_address}"

    # Print the command being executed for debugging
    print(f"Executing command: {command}")

    # Execute the command
    try:
        response = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout = response.stdout.decode()
        stderr = response.stderr.decode()

        # Check the response
        if response.returncode == 0:
            print(f"Device {ip_address} is reachable.")
            return True
        else:
            print(f"Device {ip_address} is not reachable.")
            print("Ping output:", stdout)
            print("Ping error:", stderr)
            return False
    except Exception as e:
        print(f"An error occurred while pinging the device: {e}")
        return False

# Function to check if the device is reachable via HTTP
def check_device_http(ip_address):
    url = f"http://{ip_address}"
    try:
        # Increase the timeout for slow devices
        response = requests.get(url, timeout=10)  # Timeout increased to 10 seconds
        if response.status_code == 200:
            print(f"Device {ip_address} is reachable via HTTP.")
            return True
        else:
            print(f"Device {ip_address} is not reachable via HTTP. Status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while checking the device via HTTP: {e}")
        return False

# Example usage
ip_address = os.getenv("IP_ADDRESS") 

# Ping the device
ping_device(ip_address)

# Check device via HTTP
check_device_http(ip_address)
