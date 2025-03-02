import sqlite3
import hashlib
import os

def init_db():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS projects
                 (id INTEGER PRIMARY KEY,
                 title TEXT,
                 description TEXT,
                 languages TEXT,
                 image TEXT)''')
    
    # Создаем таблицу пользователей, если она не существует
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY,
                 username TEXT UNIQUE,
                 password_hash TEXT,
                 salt TEXT)''')

    conn.commit()
    conn.close()

def add_project(title, description, languages, image):
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()

    c.execute("INSERT INTO projects (title, description, languages, image) VALUES (?, ?, ?, ?)",
              (title, description, languages, image))

    conn.commit()
    conn.close()

def get_projects():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()

    c.execute("SELECT * FROM projects")
    projects = c.fetchall()

    conn.close()

    return projects

def get_project_by_id(id):
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()

    c.execute("SELECT * FROM projects WHERE id=?", (id,))
    project = c.fetchone()

    conn.close()

    return project

def delete_project(id):
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()

    c.execute("DELETE FROM projects WHERE id=?", (id,))

    conn.commit()
    conn.close()

# Функции для работы с аутентификацией

def hash_password(password, salt=None):
    """Хеширует пароль с солью для безопасного хранения"""
    if salt is None:
        salt = os.urandom(32)  # Генерируем 32 байта случайной соли
    
    # Хешируем пароль с солью
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',  # Алгоритм хеширования
        password.encode('utf-8'),  # Переводим пароль в байты
        salt,  # Соль
        100000  # Количество итераций
    )
    
    return password_hash.hex(), salt.hex()

def create_user(username, password):
    """Создает нового пользователя в базе данных"""
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    # Проверяем, существует ли уже пользователь с таким именем
    c.execute("SELECT id FROM users WHERE username=?", (username,))
    if c.fetchone() is not None:
        conn.close()
        return False, "Пользователь с таким именем уже существует"
    
    # Хешируем пароль
    password_hash, salt = hash_password(password)
    
    # Сохраняем пользователя в базе данных
    c.execute("INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)",
              (username, password_hash, salt))
    
    conn.commit()
    conn.close()
    
    return True, "Пользователь успешно создан"

def verify_user(username, password):
    """Проверяет учетные данные пользователя"""
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    # Получаем хеш и соль для пользователя
    c.execute("SELECT password_hash, salt FROM users WHERE username=?", (username,))
    user_data = c.fetchone()
    
    conn.close()
    
    if user_data is None:
        return False
    
    stored_hash, salt = user_data
    
    # Хешируем введенный пароль с сохраненной солью
    calculated_hash, _ = hash_password(password, bytes.fromhex(salt))
    
    # Сравниваем хеши
    return calculated_hash == stored_hash

def user_exists():
    """Проверяет, существует ли хотя бы один пользователь в системе"""
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    c.execute("SELECT COUNT(*) FROM users")
    count = c.fetchone()[0]
    
    conn.close()
    
    return count > 0