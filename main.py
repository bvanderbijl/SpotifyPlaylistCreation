import os
import requests
from dotenv import load_dotenv


def main():
    load_dotenv()
    
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    

if __name__ == "__main__":
    main()