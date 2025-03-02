from flask import Flask, render_template, request, redirect, url_for, flash, session
import os
from werkzeug.utils import secure_filename
import database
import functools

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Генерируем случайный секретный ключ для сессий
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Инициализируем базу данных
database.init_db()

# Создаем папку для загрузок, если она не существует
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Декоратор для проверки авторизации
def login_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Пожалуйста, войдите в систему для доступа к этой странице', 'error')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    # Здесь вы можете заменить данными о себе
    user_info = {
        'name': 'Владимир',
        'surname': 'Диего',
        'country': 'Канада',
        'programming_language': 'Python, Java, Node.JS',
        'experience': '2 года',
        'links': 'https://github.com/BlazeDevelop'
    }
    # Получаем проекты для отображения на главной странице
    projects = database.get_projects()
    return render_template('index.html', user_info=user_info, projects=projects)

@app.route('/projects')
def projects():
    projects = database.get_projects()
    return render_template('projects.html', projects=projects)

@app.route('/project/<int:id>')
def project_detail(id):
    project = database.get_project_by_id(id)
    if project is None:
        return redirect(url_for('projects'))
    return render_template('project_detail.html', project=project)

# Маршрут для страницы входа
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    success = None
    
    # Если администратор еще не создан, перенаправляем на страницу настройки
    if not database.user_exists():
        return redirect(url_for('setup'))
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if database.verify_user(username, password):
            session['logged_in'] = True
            session['username'] = username
            
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            return redirect(url_for('index'))
        else:
            error = 'Неверное имя пользователя или пароль'
    
    return render_template('login.html', error=error, success=success)

# Маршрут для начальной настройки аккаунта администратора
@app.route('/setup', methods=['GET', 'POST'])
def setup():
    # Если администратор уже создан, перенаправляем на страницу входа
    if database.user_exists():
        return redirect(url_for('login'))
    
    error = None
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            error = 'Пароли не совпадают'
        else:
            success, message = database.create_user(username, password)
            if success:
                flash('Аккаунт администратора успешно создан', 'success')
                return redirect(url_for('login'))
            else:
                error = message
    
    return render_template('setup.html', error=error)

# Маршрут для выхода из системы
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    flash('Вы успешно вышли из системы', 'success')
    return redirect(url_for('login'))

# Защищенный маршрут для добавления проекта
@app.route('/add_project', methods=['POST'])
@login_required
def add_project():
    title = request.form['title']
    description = request.form['description']
    languages = request.form['languages']

    if 'image' not in request.files:
        flash('Нет файла изображения', 'error')
        return redirect(request.url)
    
    file = request.files['image']
    
    if file.filename == '':
        flash('Не выбран файл', 'error')
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        # Сохраняем путь относительно static директории
        image_path = 'uploads/' + filename
        
        database.add_project(title, description, languages, image_path)
        flash('Проект успешно добавлен', 'success')
        
        return redirect(url_for('projects'))
    
    return redirect(url_for('projects'))

# Защищенный маршрут для удаления проекта
@app.route('/delete_project/<int:id>', methods=['POST'])
@login_required
def delete_project(id):
    database.delete_project(id)
    flash('Проект успешно удален', 'success')
    return redirect(url_for('projects'))

if __name__ == '__main__':
    app.run(debug=True)
