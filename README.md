# Личный кабинет

Личный кабинет — это веб-платформа для сотрудников и стажёров, объединяющая
личный профиль, адаптацию, обучение, справочную информацию и управление доступами.

Проект состоит из двух частей:

- `frontend` — клиентская часть на React + TypeScript
- `backend` — REST API на Laravel

## 🚀 Архитектура и стек

### Фронтенд

- JavaScript/TypeScript
- React
- React Router
- Redux Toolkit
- RTK Query
- Vite
- Tailwind CSS + shadcn/ui
- ESLint

### Бэкенд

- PHP 8.2
- Laravel 12
- MySQL (в тестах — SQLite)
- Sanctum для аутентификации по токенам
- LDAP для входа и справочника сотрудников
- Pest для тестов
- Pint для форматирования кода

## 📂 Структура проекта

```text
lk-corp/
├── backend/                # API и логика бизнес-процессов
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   ├── composer.json
│   └── artisan
├── frontend/               # Клиентский интерфейс
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── README.md               # Документация проекта
├── .gitignore
└── .env.example*          # при необходимости создаётся в подпапках
```

## ⚙️ Запуск проекта

### 1. Бэкенд

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Для локальной разработки можно использовать:

```bash
composer dev
```

### 2. Фронтенд

```bash
cd frontend
npm install
cp .env.example .env
# или создать .env с адресом API
# VITE_BACKEND_LOCATION=http://localhost:8000/
npm run dev
```

Для продакшн-сборки:

```bash
npm run build
```

## Аутентификация

- Вход выполняется через LDAP-логин и пароль.
- После успешного входа сервер возвращает токен Sanctum.
- Токен передаётся в заголовке `Authorization: Bearer <token>`.
- Для фронтенда токен хранится в cookie и автоматически подставляется в запросы.

## Основные возможности

- личный кабинет сотрудника и стажёра
- адаптационные планы и задачи
- обучающие материалы
- справочник сотрудников и подразделений
- разграничение доступа по ролям
- работа с LDAP и базой данных
