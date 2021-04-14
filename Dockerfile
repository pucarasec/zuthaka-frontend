FROM node:12.22.1-buster
WORKDIR /frontend
COPY  ./ ./
RUN yarn
RUN yarn build
