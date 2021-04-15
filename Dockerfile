FROM node:12.22.1-buster
WORKDIR /frontend
COPY  ./ ./
ARG API_URL
RUN yarn
RUN yarn build
