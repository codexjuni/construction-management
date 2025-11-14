import argparse, os, sys, datetime as dt
import pandas as pd
from pydantic import BaseModel, validator
from dotenv import load_dotenv

# Force-load .env (absolute path to avoid Windows path issues)
load_dotenv("C:\\Users\\dale\\construction-management\\.env")

class BondRow(BaseModel):
    bond_number: str
    surety_name: str | None = None
    project_name: str | None = None
    bond_amount: float | None = None
    bond_date: str | None = None

    @validator("bond_amount", pre=True)
    def _num(cls, v):
        if v in (None, "", "NA"):
            return None
        try:
            return float(str(v).replace(",", ""))
        except:
            raise ValueError("Invalid bond_amount")

def read_excel(path: str) -> pd.DataFrame:
    xl = pd.ExcelFile(path)
    return xl.parse(xl.sheet_names[0])

def transform(df: pd.DataFrame) -> pd.DataFrame:
    colmap = {
        "Bond #": "bond_number",
        "Surety": "surety_name",
        "Project": "project_name",
        "Amount": "bond_amount",
        "Bond Date": "bond_date",
    }
    df = df.rename(columns={c: c.strip() for c in df.columns})
    out = pd.DataFrame()
    for src, dst in colmap.items():
        out[dst] = df[src] if src in df.columns else None
    if "bond_date" in out:
        out["bond_date"] = pd.to_datetime(out["bond_date"], errors="coerce").dt.date
    return out

def to_py(val):
    # Normalize pandas NA/NaT to None, dates to ISO strings
    if val is None or (isinstance(val, float) and pd.isna(val)) or pd.isna(val):
        return None
    if isinstance(val, (pd.Timestamp, dt.date)):
        return val.isoformat()
    return val

def main(args):
    src = args.source or "data/bond list sample.xlsx"
    if not os.path.exists(src):
        print(f"ERR: missing source {src}", file=sys.stderr)
        sys.exit(2)

    df = read_excel(src)
    clean = transform(df)

    ts = dt.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    os.makedirs("data/import_logs", exist_ok=True)
    clean.to_csv(f"data/import_logs/bonds_clean_{ts}.csv", index=False)
    print(f"rows={len(clean)} OK")

    # === Upload to Supabase ===
    from supabase import create_client

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("Supabase credentials not found. Check your .env file.")
        sys.exit(1)

    supabase = create_client(url, key)

    cols = ["bond_number", "project_name", "bond_amount", "bond_date"]
    payload = []
    for _, row in clean.iterrows():
        payload.append({c: to_py(row.get(c)) for c in cols})

    # Upsert in batches to avoid payload size issues
    BATCH = 500
    for i in range(0, len(payload), BATCH):
        supabase.table("bonds").upsert(payload[i:i+BATCH]).execute()

    print(f"Inserted {len(clean)} rows into Supabase.")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--source", type=str, default=None)
    main(p.parse_args())