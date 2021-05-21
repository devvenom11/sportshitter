FROM bitnami/node:8.17.0-debian-10-r4-prod
# FROM bitnami/node:12.20.2-prod-debian-10-r1

COPY . .

RUN npm i

CMD [ "npm", "start" ]
