import pandas as pd, streamlit as st
st.set_page_config(page_title="HHJ – Bonds", layout="wide")
st.title("Bonds – Prototype")
tab1, tab2 = st.tabs(["Import Preview", "Search"])
with tab1:
    f = st.file_uploader("Upload Bond List Excel", type=["xlsx"])
    if f: st.write("Preview", pd.read_excel(f).head(50))
with tab2:
    st.text_input("Bond #")
    st.text_input("Surety")
    st.text_input("Project")
    st.write("Search results will appear here.")
