import streamlit as st
import pandas as pd
from supabase import create_client

# ------------------
# Configuration
# ------------------
SUPABASE_URL = st.secrets["SUPABASE_URL"]
SUPABASE_KEY = st.secrets["SUPABASE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

st.set_page_config(page_title="HHJ Prototype", layout="wide")

# ------------------
# Helper Functions
# ------------------

def fetch_table(table_name):
    data = supabase.table(table_name).select('*').execute().data
    return pd.DataFrame(data)

def add_record(table, record):
    supabase.table(table).insert(record).execute()

def get_bond_details(bond_number):
    bond_data = supabase.table("bonds").select('*').eq('bond_number', bond_number).execute().data
    if not bond_data:
        return None
    bond = bond_data[0]

    contract_data = supabase.table("contracts").select('*').eq('bond_number', bond_number).execute().data
    contract = contract_data[0] if contract_data else None

    client = None
    if contract and contract.get('client_id'):
        client_data = supabase.table("clients").select('*').eq('client_id', contract['client_id']).execute().data
        client = client_data[0] if client_data else None

    return {"bond": bond, "contract": contract, "client": client}

# ------------------
# Navigation
# ------------------

menu = st.sidebar.radio("Select Module", ["Clients", "Contracts", "Bonds", "Bond Lookup"])

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
        client_id = (
            clients.loc[clients["client_name"] == client, "client_id"].values[0]
            if not clients.empty else None
        )
        contract_no = st.text_input("Contract No")
        amount = st.number_input("Contract Amount", min_value=0.0, step=1000.0)
        bond_number = st.text_input("Bond Number")
        bond_company = st.text_input("Bond Company")

        if st.form_submit_button("Add"):
            add_record("contracts", {
                "client_id": client_id,
                "contract_no": contract_no,
                "contract_amount": amount,
                "bond_number": bond_number,
                "bond_company": bond_company
            })
            st.success("Contract added.")

# ------------------
# Bonds Module
# ------------------
elif menu == "Bonds":
    st.header("Bonds")
    df_bonds = fetch_table("bonds")
    st.dataframe(df_bonds, use_container_width=True)

    with st.form("add_bond"):
        st.subheader("Add Bond")
        bond_number = st.text_input("Bond Number")
        bond_company = st.text_input("Bond Company")
        bond_date = st.date_input("Bond Date")
        bond_status = st.text_input("Bond Status")

        if st.form_submit_button("Add"):
            add_record("bonds", {
                "bond_number": bond_number,
                "bond_company": bond_company,
                "bond_date": str(bond_date),
                "bond_status": bond_status
            })
            st.success("Bond added.")

# ------------------
# Bond Lookup Module
# ------------------
elif menu == "Bond Lookup":
    st.header("Bond Lookup")
    bond_number = st.text_input("Enter Bond Number")

    if st.button("Search"):
        details = get_bond_details(bond_number)
        if not details:
            st.error("No record found for this bond number.")
        else:
            bond = details['bond']
            contract = details['contract']
            client = details['client']

            st.subheader("Bond Information")
            st.write(pd.DataFrame([bond]))

            if contract:
                st.subheader("Contract Information")
                st.write(pd.DataFrame([contract]))

            if client:
                st.subheader("Client Information")
                st.write(pd.DataFrame([client]))