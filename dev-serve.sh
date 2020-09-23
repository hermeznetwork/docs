#!/bin/sh

case "$1" in
    docker)
        sudo docker run -it -v $PWD/docs:/docs:ro -p 3000:3000 quintoandar/docsify
        ;;
    *)
        if [ ! -f ./node_modules/.bin/docsify ]; then
            npm i docsify-cli
        fi

        ./node_modules/.bin/docsify serve docs
        ;;
    esac
