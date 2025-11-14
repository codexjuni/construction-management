from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")
print("URL:", os.getenv("SUPABASE_URL"))
print("KEY:", "set" if os.getenv("SUPABASE_SERVICE_ROLE_KEY") else "missing")
