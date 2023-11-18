# Print Designer

Print Designer is open source project, which based on Payload CMS, Vue.js and Fabric.js

![website](https://github.com/lmanukyan/print-designer/blob/develop/screenshot.jpg?raw=true)

## Demo

https://app.print-rtp.ru/

## Database
For storing records is used [MongoDB](https://mongodb.com)

## Installation

Clone the project

```bash
git clone https://github.com/lmanukyan/print-designer.git
cd print-designer
```

Create .env file

```bash
cp .env.example .env
# do not forget fill the file
```

Installation of dependencies

```bash
yarn install
yarn install:app
```
## Development

Start the backend

```bash
yarn dev
# Admin panel is available on address
# http://localhost:3050/admin
```

Start the frontend

```bash
yarn dev:app
# App is available on address
# http://localhost:3040
```
## Environment Variables

Backend .env variables

`MONGODB_URI` - MongoDB connection string

`PAYLOAD_SECRET` - Payload secret key

`PAYLOAD_DOMAIN` - Site address

`SMTP_HOST` - SMTP host

`SMTP_PORT` - SMTP port

`SMTP_USER` - SMTP login

`SMTP_PASS` - SMTP password

`SMTP_NAME` - Sender name

`MANAGER_EMAIL` - Receiver email address


Frontend .env variables

`VUE_APP_API_URL` - Address for API requests

## Deployment

Build backend & frontend

```bash
yarn build
```

Run backend via pm2

```bash
NODE_ENV=production && pm2 start server.js
```

Nginx config

```bash
server {
  listen 80;
  server_name _;
  
  location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```