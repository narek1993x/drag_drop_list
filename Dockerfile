FROM node:8.11.1
MAINTAINER Narek Khachatryan <narek1993c@gmail.com>

COPY package*.json /tmp/dnd-app/
RUN cd /tmp/dnd-app && npm install --no-progress --ignore-optional

# copy our application code
WORKDIR /opt/dnd-app
COPY . /opt/dnd-app/
RUN cp -a /tmp/dnd-app/node_modules /opt/dnd-app

# expose port
EXPOSE 8080

# start app
CMD ["npm", "start"]

# another way of config

# FROM node:8.11.1
# MAINTAINER Narek Khachatryan <narek1993c@gmail.com>

# # copy our application code
# ADD . /opt/dnd-app
# WORKDIR /opt/dnd-app

# # fetch app specific deps
# RUN npm install --no-progress --ignore-optional

# # expose port
# EXPOSE 8080

# # start app
# CMD ["npm", "start"]
