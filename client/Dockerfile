FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json .
RUN npm ci

# COPY .eslintignore .eslintrc.json .
COPY angular.json ./
COPY tsconfig*.json .
COPY . .
RUN npx ng build

FROM nginx:alpine
COPY --from=build /app/dist/client/browser /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80