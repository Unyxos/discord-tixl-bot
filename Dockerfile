FROM alpine
RUN apk add --update nodejs npm tzdata
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /home/
ADD . .
RUN npm install

CMD ["node", "main.js"]
