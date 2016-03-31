

FROM node
CMD ["npm install -g webpack"]
RUN mkdir /app
RUN mkdir /app/server
RUN mkdir /app/client
RUN mkdir /app/client/desktop
ADD server/. /app/server
ADD client/desktop/. /app/client/desktop
ADD package.json /app
ADD Dockerfile /app

WORKDIR /app/client/desktop
CMD ["webpack"]

WORKDIR /app
RUN npm install


EXPOSE 3000
CMD ["npm", "start"]