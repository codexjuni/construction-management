import argparse, os, sys, datetime as dt
import pandas as pd
from pydantic import BaseModel, validator
from dotenv import load_dotenv
load_dotenv()
class BondRow(BaseModel):
    bond_number: str
    surety_name: str | None = None
    project_name: str | None = None
    bond_amount: float | None = None
    bond_date: str | None = None
    @validator("bond_amount", pre=True)
    def _num(cls, v):
        if v in (None, "", "NA"): return None
        try: return float(str(v).replace(",", ""))
        except: raise ValueError("Invalid bond_amount")
def read_excel(path: str) -> pd.DataFrame:
    xl = pd.ExcelFile(path)
    return xl.parse(xl.sheet_names[0])
def transform(df: pd.DataFrame) -> pd.DataFrame:
    colmap = {"Bond #": "bond_number", "Surety": "surety_name", "Project": "project_name", "Amount": "bond_amount", "Bond Date": "bond_date"}
    df = df.rename(columns={c: c.strip() for c in df.columns})
    out = pd.DataFrame()
    for src, dst in colmap.items():
        out[dst] = df[src] if src in df.columns else None
    if "bond_date" in out:
        out["bond_date"] = pd.to_datetime(out["bond_date"], errors="coerce").dt.date.astype("string")
    return out
def main(args):
    src = args.source or "data/bond list sample.xlsx"
    if not os.path.exists(src):
        print(f"ERR: missing source {src}", file=sys.stderr); sys.exit(2)
    df = read_excel(src)
    clean = transform(df)
    ts = dt.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    os.makedirs("data/import_logs", exist_ok=True)
    clean.to_csv(f"data/import_logs/bonds_clean_{ts}.csv", index=False)
    print(f"rows={len(clean)} OK")
if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--source", type=str, default=None)
    main(p.parse_args())
