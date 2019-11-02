FROM node:alpine
ADD ./webpack /siep-pwa/
WORKDIR /siep-pwa/

# Descarga el ultimo estado de los commit en los repo developer y master
RUN wget https://api.github.com/repos/decyt-tdf/siep-pwa/commits/master && mv master /siep-pwa/static/master.json
RUN wget https://api.github.com/repos/decyt-tdf/siep-pwa/commits/developer && mv developer /siep-pwa/static/developer.json

# Instala dependencias para python
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g
CMD ["sh","/siep-pwa/docker_init.sh"]

