import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import numpy as np

# --------------------------------------------------
# Load environment variables
# --------------------------------------------------
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# --------------------------------------------------
# Load CSV
# --------------------------------------------------
file_path = "data/contract_import.csv"
print(f"Loading file: {file_path}")
df = pd.read_csv(file_path)

# --------------------------------------------------
# Normalize blanks and currency formatting
# --------------------------------------------------
df = df.replace({np.nan: None, "": None, "nan": None})

def clean_currency(x):
    if isinstance(x, str):
        x = x.replace("$", "").replace(",", "").strip()
        return float(x) if x not in ("", None) else None
    return x

for col in ["contract_amount", "bond_inv_amount", "refund"]:
    if col in df.columns:
        df[col] = df[col].apply(clean_currency)

# Clean invalid date symbols like "?" or "-"
for col in ["contract_start", "contract_end", "completion_date", "acceptance_date", "bid_ad_date", "bond_date"]:
    if col in df.columns:
        df[col] = df[col].apply(lambda x: None if isinstance(x, str) and (x.strip() in ["", "?", "-"]) else x)

# --------------------------------------------------
# Split datasets
# --------------------------------------------------
contracts = (
    df[[
        "contract_number", "contract_name", "client_id", "contract_amount",
        "contract_type", "contract_status", "contract_stage",
        "contract_start", "contract_end", "completion_date",
        "acceptance_date", "company_name", "bid_ad_date"
    ]]
    .drop_duplicates(subset=["contract_number"])
)

bonds = (
    df[[
        "contract_number", "bond_number", "bond_company", "bond_date",
        "bond_inv_number", "bond_inv_amount", "bond_status",
        "refund", "description", "notes"
    ]]
    .rename(columns={"notes": "bond_notes"})
)

# --------------------------------------------------
# Upload helper
# --------------------------------------------------
def safe_upsert(table, rows):
    for _, row in rows.iterrows():
        record = {k: (None if isinstance(v, float) and np.isnan(v) else v) for k, v in row.to_dict().items()}
        try:
            # Try upsert (will overwrite existing contract_number if conflict)
            supabase.table(table).upsert(record).execute()
        except Exception as e:
            print(f"⚠️ {table} insert error: {e}")

print("Uploading contracts...")
safe_upsert("contracts", contracts)

print("Uploading bonds...")
safe_upsert("bonds", bonds)

print("✅ Import complete.")
