// Файл animations.js - скрипты для анимаций и интерактивных эффектов на сайте

document.addEventListener('DOMContentLoaded', function() {
  // Анимация элементов при прокрутке
  const animateOnScroll = function() {
    // Элементы, которые нужно анимировать
    const items = document.querySelectorAll('.portfolio-item, .skill-category, .contact-card');
    
    items.forEach(item => {
      const position = item.getBoundingClientRect();
      
      // Анимируем элементы, когда они входят в видимую область
      if(position.top < window.innerHeight - 100) {
        item.classList.add('in-view');
      }
    });
  };
  
  // Запускаем анимацию при загрузке и при прокрутке
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);
  
  // Анимация прогресс-баров для навыков
  setTimeout(function() {
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(bar => {
      const width = bar.getAttribute('data-progress') || bar.parentElement.previousElementSibling.querySelector('.skill-level').textContent;
      bar.style.width = width;
    });
  }, 500);
  
  // Обработка формы загрузки файла - показывать имя выбранного файла
  const fileInput = document.getElementById('file-upload');
  const fileNameDisplay = document.getElementById('file-name');
  
  if(fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', function() {
      if(this.files && this.files[0]) {
        fileNameDisplay.textContent = this.files[0].name;
        fileNameDisplay.parentElement.classList.add('file-selected');
      } else {
        fileNameDisplay.textContent = 'Файл не выбран';
        fileNameDisplay.parentElement.classList.remove('file-selected');
      }
    });
  }
  
  // Добавляем эффект пульсации для кнопок отправки
  const submitButtons = document.querySelectorAll('.btn-submit, .primary-btn, .secondary-btn');
  
  submitButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.classList.add('pulse-animation');
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('pulse-animation');
    });
  });
  
  // Плавная прокрутка для якорных ссылок
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Анимация для навигационных ссылок
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const currentPage = window.location.pathname;
    const linkHref = link.getAttribute('href');
    
    // Подсвечиваем активную ссылку
    if(currentPage === linkHref || 
       (currentPage === '/' && linkHref === '/') || 
       (currentPage.includes('project') && linkHref === '/projects')) {
      link.classList.add('active');
    }
  });
  
  // Добавляем "эффект волны" при клике на кнопки
  const allButtons = document.querySelectorAll('.btn, .btn-submit, .primary-btn, .secondary-btn, .action-btn');
  
  allButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - this.getBoundingClientRect().left;
      const y = e.clientY - this.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Улучшенная анимация прокрутки иконок
  const scrollIcons = () => {
    const iconScrollElements = document.querySelectorAll('.icon-scroll');
    if (iconScrollElements.length > 0) {
      // Корректно расположим иконки вертикально вдоль левой стороны
      iconScrollElements.forEach(scrollElement => {
        // Копируем иконки для создания непрерывной анимации
        const origIcons = Array.from(scrollElement.querySelectorAll('i'));
        const height = origIcons.length * 50; // Примерная высота на основе количества иконок
        
        // Заставляем контейнер правильно прокручиваться вертикально
        scrollElement.style.display = 'flex';
        scrollElement.style.flexDirection = 'column';
        scrollElement.style.animation = 'none';
        
        // Добавляем анимацию вертикальной прокрутки
        setTimeout(() => {
          scrollElement.style.animation = 'verticalScroll 30s linear infinite';
        }, 100);
      });
      
      // Добавляем новый keyframe для вертикальной прокрутки если его еще нет
      if (!document.querySelector('style#vertical-scroll-keyframes')) {
        const style = document.createElement('style');
        style.id = 'vertical-scroll-keyframes';
        style.textContent = `
          @keyframes verticalScroll {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  };
  
  // Инициализация плавающих иконок для формы добавления проекта
  const initFloatingIcons = () => {
    const scrollIconsContainer = document.querySelector('.scroll-icons-container');
    if (scrollIconsContainer) {
      // Анимация случайного движения иконок
      const floatingIcons = scrollIconsContainer.querySelectorAll('.floating-icon');
      floatingIcons.forEach(icon => {
        // Случайное начальное положение и задержка
        const delayRandom = Math.random() * 5;
        icon.style.animationDelay = `${delayRandom}s`;
      });
    }
  };
  
  // Эффекты для полей формы добавления проекта
  const initFormFieldEffects = () => {
    const formFields = document.querySelectorAll('.form-field');
    formFields.forEach(field => {
      const input = field.querySelector('input, textarea');
      const label = field.querySelector('label');
      
      if (input && label) {
        // Проверка заполненности при загрузке
        if (input.value.trim()) {
          field.classList.add('filled');
        }
        
        // Проверка заполненности при вводе
        input.addEventListener('input', function() {
          if (this.value.trim()) {
            field.classList.add('filled');
          } else {
            field.classList.remove('filled');
          }
        });
        
        // Анимация иконок при фокусе
        input.addEventListener('focus', function() {
          const icon = label.querySelector('i');
          if (icon) {
            field.classList.add('focus-active');
          }
        });
        
        input.addEventListener('blur', function() {
          field.classList.remove('focus-active');
        });
      }
    });
  };
  
  // Улучшенная обработка загрузки изображений с предпросмотром
  const enhanceFileUploader = () => {
    const uploadField = document.querySelector('.upload-field');
    const fileInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const imagePreview = document.getElementById('image-preview');
    
    if (uploadField && fileInput) {
      // Обработка выбора файла
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          // Обновляем имя файла
          fileNameDisplay.textContent = this.files[0].name;
          fileNameDisplay.classList.add('file-selected');
          
          // Создаем предпросмотр изображения
          const reader = new FileReader();
          
          reader.onload = function(e) {
            imagePreview.src = e.target.result;
            // Анимация появления изображения
            imagePreview.classList.add('image-loaded');
          }
          
          reader.readAsDataURL(this.files[0]);
        } else {
          fileNameDisplay.textContent = 'Файл не выбран';
          fileNameDisplay.classList.remove('file-selected');
          imagePreview.src = 'static/img/upload-placeholder.jpg';
          imagePreview.classList.remove('image-loaded');
        }
      });
      
      // Добавляем эффект перетаскивания файла (drag and drop)
      uploadField.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadField.classList.add('drag-over');
      });
      
      uploadField.addEventListener('dragleave', function() {
        uploadField.classList.remove('drag-over');
      });
      
      uploadField.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadField.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        
        if (files.length > 0) {
          // Имитировать выбор файла
          fileInput.files = files;
          
          // Вызываем событие change для обновления отображения
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
        }
      });
    }
  };
  
  // Запускаем функции
  scrollIcons();
  initFloatingIcons();
  initFormFieldEffects();
  enhanceFileUploader();
});

// Анимация для ленивой загрузки изображений
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.add('fade-in');
          observer.unobserve(image);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Резервный вариант для браузеров, не поддерживающих IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('fade-in');
    });
  }
}); 