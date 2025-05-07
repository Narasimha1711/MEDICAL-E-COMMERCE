
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV MONGODB_CONNECTION=$MONGODB_CONNECTION
EXPOSE 9001
CMD ["npm", "start"]