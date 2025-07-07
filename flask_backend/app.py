from flask import Flask, request, render_template
import requests
import pyodbc

app = Flask(__name__)

# 🔹 Koneksi ke database SQL Server
conn = pyodbc.connect(
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=localhost\\MSSQLSERVER06;"
    "Database=whatsapp_sender;"
    "Trusted_Connection=yes;"
)

# 🔹 Endpoint Baileys
BAILEYS_API_URL = "http://localhost:3000/send"

# 🔹 Halaman utama
@app.route("/")
def index():
    return render_template("index.html")

# 🔹 Endpoint kirim semua pesan
@app.route("/send-all", methods=["POST"])
def send_all_messages():
    cursor = conn.cursor()
    cursor.execute("SELECT Nomor, Caption, NamaFile FROM WhatsAppMessages")
    rows = cursor.fetchall()

    success = []
    failed = []

    for nomor, caption, nama_file in rows:
        payload = {
            "nomor": nomor,
            "caption": caption,
            "nama_file": nama_file
        }

        try:
            response = requests.post(BAILEYS_API_URL, json=payload)
            if response.status_code == 200:
                success.append(nomor)
            else:
                failed.append({"nomor": nomor, "error": response.text})
        except Exception as e:
            failed.append({"nomor": nomor, "error": str(e)})

    return render_template("result.html", success=success, failed=failed)

# 🔹 Jalankan aplikasi Flask
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
