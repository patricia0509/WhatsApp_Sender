CREATE DATABASE whatsapp_sender;

USE whatsapp_sender;

CREATE TABLE WhatsAppMessages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nomor VARCHAR(20) NOT NULL,
    NamaFile VARCHAR(255) NOT NULL,
    Caption TEXT
);

INSERT INTO WhatsAppMessages (Nomor, NamaFile, Caption)
VALUES 
('6281270490972', 'B2-02.png', 'Berikut QR Code anda'),
('6281381531711', 'B2-02.png', 'Berikut QR Code anda'),
('6285799460545', 'B2-02.png', 'Berikut QR Code anda'),
('6287880082562', 'B2-02.png', 'Berikut QR Code anda');
