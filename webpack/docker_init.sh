#!/usr/bin/env sh

echo "Start build"
npm run build
cp ./dist/static/firebase-messaging-sw.js ./dist/firebase-messaging-sw.js
npm run server
