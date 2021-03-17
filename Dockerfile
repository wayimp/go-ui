FROM node

COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

RUN npm run-script build

EXPOSE 8045

CMD [ "npm", "start" ]
