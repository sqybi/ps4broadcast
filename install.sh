#!/usr/bin/env bash

set -e

echo "Installing the required software, please make sure sudo has been installed and enter password if necessary..."
sudo apt-get update
sudo apt-get install -y git libpcre3-dev nodejs openssl libssl-dev gcc g++ automake zlib1g-dev make psmisc

echo "Downloading nginx..."
pushd /tmp
  wget http://nginx.org/download/nginx-1.18.0.tar.gz
  tar -xvf nginx-1.18.0.tar.gz
  pushd nginx-1.18.0
    echo "Clone nginx-rtmp-module from Github..."
    git clone https://github.com/arut/nginx-rtmp-module.git
    echo "Compiling nginx with rtmp-module..."
    ./configure --prefix=/usr/local/nginx/ --add-module=./nginx-rtmp-module
    make CFLAGS='-Wno-implicit-fallthrough'
    echo "Installing nginx to /usr/local/nginx..."
    sudo make install
  popd
popd

echo "Done!"
