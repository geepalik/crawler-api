FROM node:14.18.1-alpine

WORKDIR /usr/src/app
COPY package.json /usr/src/app/

#install dependenices in container, including puppeteer
RUN apk add --no-cache udev ttf-freefont chromium git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN npm install
COPY ./ /usr/src/app/
RUN npm run build

CMD [ "node", "dist/main.js" ]