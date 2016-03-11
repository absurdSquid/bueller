FROM node
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN npm install

EXPOSE 8000
CMD ["node", "index.js"]