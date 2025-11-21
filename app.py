import os

import streamlit as st
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

# ------------------
# Configuration
# ------------------
load_dotenv()  # Load .env environment variables

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ["SUPABASE_ANON_KEY"]
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

st.set_page_config(page_title="HHJ Prototype", layout="wide")

# ------------------
# Helper Functions
# ------------------

def fetch_table(table_name: str) -> pd.DataFrame:
    """Return a DataFrame for the given table (or empty DF if no rows)."""
    response = supabase.table(table_name).select("*").execute()
    return pd.DataFrame(response.data or [])


def add_record(table: str, record: dict) -> None:
    """Insert a record into Supabase, cleaning numpy types."""
    cleaned: dict = {}
    for key, value in record.items():
        try:
            import numpy as np  # local import to avoid hard dependency elsewhere
            if isinstance(value, np.generic):
                value = value.item()
        except Exception:
            pass
        cleaned[key] = value

    supabase.table(table).insert(cleaned).execute()


def search_bonds(bond_number: str = "", contract_number: str = "", bond_company: str = ""):
    """Case-insensitive, partial search on bonds by any combination of fields."""
    query = supabase.table("bonds").select("*")
    if bond_number:
        query = query.ilike("bond_number", f"%{bond_number}%")
    if contract_number:
        query = query.ilike("contract_number", f"%{contract_number}%")
    if bond_company:
        query = query.ilike("bond_company", f"%{bond_company}%")
    return query.execute().data


# ------------------
# Navigation
# ------------------
menu = st.sidebar.radio(
    "Select Module",
    ["Clients", "Contracts", "Bonds", "Bond Lookup", "Overview"],
)

# ------------------
# Clients Module
# ------------------
if menu == "Clients":
    st.header("Client Directory")
    df_clients = fetch_table("clients")
    st.dataframe(df_clients, use_container_width=True)

    with st.form("add_client"):
        st.subheader("Add Client")
        name = st.text_input("Client Name")
        code = st.text_input("Client Code")
        if st.form_submit_button("Add"):
            if not name:
                st.error("Client Name is required.")
            else:
                add_record("clients", {"client_name": name, "client_code": code})
                st.success("Client added.")

# ------------------
# Contracts Module
# ------------------
elif menu == "Contracts":
    st.header("Contracts")
    df_contracts = fetch_table("contracts")
    st.dataframe(df_contracts, use_container_width=True)

    clients = fetch_table("clients")

    with st.form("add_contract"):
        st.subheader("Add Contract")
        client = st.selectbox("Client", clients["client_name"] if not clients.empty else [])
        client_id = None
        if not clients.empty and client:
            # Cast to plain Python int to avoid numpy int64
            raw_id = clients.loc[clients["client_name"] == client, "client_id"].values[0]
            client_id = int(raw_id)

        contract_no = st.text_input("Contract No")
        amount = st.number_input("Contract Amount", min_value=0.0, step=1000.0)

        if st.form_submit_button("Add"):
            if not contract_no:
                st.error("Contract No is required.")
            else:
                add_record("contracts", {
                    "client_id": client_id,
                    "contract_number": contract_no,
                    "contract_amount": float(amount),
                })
                st.success("Contract added.")

# ------------------
# Bonds Module
# ------------------
elif menu == "Bonds":
    st.header("Bonds")
    df_bonds = fetch_table("bonds")
    if not df_bonds.empty and "bond_date" in df_bonds.columns:
        df_bonds["bond_date"] = pd.to_datetime(df_bonds["bond_date"]).dt.strftime("%m/%d/%y")
    st.dataframe(df_bonds, use_container_width=True)

    with st.form("add_bond"):
        st.subheader("Add Bond")
        contract_number = st.text_input("Contract Number")
        bond_number = st.text_input("Bond Number")
        bond_company = st.text_input("Bond Company")
        bond_date = st.date_input("Bond Date")
        bond_status = st.text_input("Bond Status")

        if st.form_submit_button("Add"):
            if not bond_number:
                st.error("Bond Number is required.")
            else:
                add_record("bonds", {
                    "contract_number": contract_number,
                    "bond_number": bond_number,
                    "bond_company": bond_company,
                    "bond_date": str(bond_date),  # stored as ISO, formatted on display
                    "bond_status": bond_status,
                })
                st.success("Bond added.")

# ------------------
# Bond Lookup Module
# ------------------
elif menu == "Bond Lookup":
    st.header("Bond Lookup")

    with st.form("bond_lookup"):
        bond_number = st.text_input("Bond Number (partial, optional)")
        contract_number = st.text_input("Contract Number (partial, optional)")
        bond_company = st.text_input("Bond Company (partial, optional)")
        do_search = st.form_submit_button("Search")

    if do_search:
        rows = search_bonds(
            bond_number=bond_number,
            contract_number=contract_number,
            bond_company=bond_company,
        )
        if not rows:
            st.error("No records found.")
        else:
            st.subheader(f"Results ({len(rows)})")
            df_results = pd.DataFrame(rows)
            if not df_results.empty and "bond_date" in df_results.columns:
                df_results["bond_date"] = pd.to_datetime(df_results["bond_date"]).dt.strftime("%m/%d/%y")
            st.dataframe(df_results, use_container_width=True)

# ------------------
# Overview Module (joins multiple tables + client filter, sorted, no duplicates)
# ------------------
elif menu == "Overview":
    st.header("Contracts / Clients / Bonds Overview")

    df_contracts = fetch_table("contracts")
    df_clients = fetch_table("clients")
    df_bonds = fetch_table("bonds")

    if df_contracts.empty or df_clients.empty:
        st.info("No contracts or clients found.")
    else:
        # Build dropdown options: "CODE - NAME" and sort by client_code ascending
        df_clients = df_clients.copy()
        df_clients["display"] = df_clients.apply(
            lambda r: f"{(r.get('client_code') or '').strip()} - {r.get('client_name', '').strip()}",
            axis=1,
        )
        if "client_code" in df_clients.columns:
            df_clients = df_clients.sort_values("client_code", na_position="last")

        options = ["All clients"] + df_clients["display"].tolist()
        selected = st.selectbox("Filter by client (code or name)", options)

        filtered_contracts = df_contracts.copy()
        if selected != "All clients":
            chosen = df_clients[df_clients["display"] == selected].iloc[0]
            client_id = chosen["client_id"]
            filtered_contracts = filtered_contracts[filtered_contracts["client_id"] == client_id]

        if filtered_contracts.empty:
            st.info("No contracts for this client.")
        else:
            # Join filtered contracts -> clients on client_id
            merged = filtered_contracts.merge(
                df_clients.drop(columns=["display"]),
                on="client_id",
                how="left",
                suffixes=("", "_client"),
            )

            # Join bonds on contract_number (if present)
            if not df_bonds.empty and "contract_number" in df_bonds.columns:
                merged = merged.merge(
                    df_bonds,
                    on="contract_number",
                    how="left",
                    suffixes=("", "_bond"),
                )

            # Format bond_date if present
            if "bond_date" in merged.columns:
                merged["bond_date"] = pd.to_datetime(
                    merged["bond_date"], errors="coerce"
                ).dt.strftime("%m/%d/%y")

            # Drop duplicate rows that can appear due to joins
            merged = merged.drop_duplicates()

            st.dataframe(merged, use_container_width=True)
