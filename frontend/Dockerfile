FROM node:lts-fermium 

WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

CMD ["yarn", "start"]
