FROM        node
RUN         apt-get update && apt-get install -y nodejs
RUN         npm install
COPY        . /code
WORKDIR     /code
RUN         chmod +x index.js
CMD         ["node","index.js"]
