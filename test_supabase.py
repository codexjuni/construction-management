import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(".env")

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("URL:", url)
print("KEY length:", len(key) if key else "missing")

supabase = create_client(url, key)
response = supabase.table("bonds").select("*").limit(1).execute()
print("Query result:", response)
