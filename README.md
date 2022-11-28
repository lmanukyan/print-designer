
# Print designer

Конструктор одежды и футболок онлайн


## База данных

Для хранения записей используется MongoDB. Если MongoDB не установлен локально, то можно использовать облачное решение - [mongodb.com](https://mongodb.com)


## Подготовка к запуску

Клонировать проект

```bash
  git clone https://github.com/lmanukyan/print-designer.git
```

Перейти в каталог проекта

```bash
  cd print-designer
```

Создать .env файлы

```bash
  cp .env.sample .env
  cp app/.env.sample app/.env
```
```bash
  # не забудьте заполнить файлы
```

Установить зависимости

```bash
  yarn install
  (cd app && yarn install)
```
## Запустить локально

Запустить сервер

```bash
  yarn dev
```

Запустить фронт

```bash
  cd app
  yarn serve
```


## Переменные среды сервера

`MONGODB_URI` - строка подключения MongoDB

`PAYLOAD_SECRET` - секретный ключ 

`PAYLOAD_DOMAIN` - адрес сайта

`SMTP_HOST` - SMTP хост

`SMTP_PORT` - SMTP порт

`SMTP_USER` - SMTP логин

`SMTP_PASS` - SMTP пароль

`SMTP_NAME` - Имя отправителя

`MANAGER_EMAIL` - Email адрес получателя

## Переменные среды фронта

`VUE_APP_API_URL` - адрес для api запросов 


## Деплой

Сборка фронта

```bash
  (cd app && yarn build)
```

Сборка сервера

```bash
  yarn build
```

Запуск сервера

```bash
  yarn serve
```

Запуск сервера через pm2

```bash
  NODE_ENV=production && pm2 start server.js
```

