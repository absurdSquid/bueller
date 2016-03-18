FROM node
RUN mkdir /app
RUN mkdir /app/server
ADD server/. /app/server
ADD package.json /app
ADD Dockerfile /app
WORKDIR /app
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]