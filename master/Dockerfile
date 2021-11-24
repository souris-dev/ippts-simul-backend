FROM node:14-alpine
COPY package.json package-lock.json ./
RUN npm install --production
COPY ./jsbuild .
CMD ["node", "src/master.js", "&"]
