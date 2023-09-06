FROM ubuntu:22.04

WORKDIR /opt/app/
EXPOSE 3000

ENV NVM_DIR "/root/.nvm"
ENV PATH "/root/.nvm/versions/node/v20.0.0/bin:$PATH"

RUN apt update
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN . "$NVM_DIR/nvm.sh" && nvm install v20.0.0

COPY . /opt/app/

RUN npm install
RUN npm run build

CMD [ "npm", "run", "start" ]
