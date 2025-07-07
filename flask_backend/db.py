import pyodbc

def get_data_from_db():
    # Koneksi ke SQL Server
    
    conn = pyodbc.connect(
    "Driver={ODBC Driver 17 for SQL Server};"  # Ganti jika pakai versi driver berbeda
    "Server=localhost\\MSSQLSERVER06;"         # Ganti dengan nama instance SQL Server milik Anda
    "Database=whatsapp_sender;"                # Ganti dengan nama database Anda
    "Trusted_Connection=yes;"                 
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT Nomor, NamaFile, Caption FROM dbo.WhatsAppMessages")
    rows = cursor.fetchall()
    conn.close()
    return rows
