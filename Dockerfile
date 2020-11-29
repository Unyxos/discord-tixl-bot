FROM alpine
RUN apk add --update nodejs npm
ADD main.js /home/
ADD package.json /home/
ADD package-lock.json /home/
RUN cd /home/ && npm install

CMD ["node", "/home/index.js"]
