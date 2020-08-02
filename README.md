# Stream Forwarder -- A simple web interface for stream to Facebook and other platforms.

This project was created as a direct response to the NGINX RTMP Module not being able to stream to Facebook due to the SSL/TLS encryption. After searching for hours, it seems that NGINX will not be able to do this.

This application creates a web interface to simply forward your RTMP streams to multiple applications. The server will host its own RTMP URL to stream to, and you can add multiple destinations. This was created allow stream forwarding to both encrypted and regular RTMP streaming end points, as Facebook only supports RTMPS. Something not supported or easily implemented by NGINX. 

## Prerequisites
* Ubuntu Server 16.04 or later


## Installation

### Node.JS
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Preparing the FFMPEG
On an Ubuntu computer or VM run the following commands to create an HTTPS capable version of FFMPEG on your computer.
```ssh
sudo apt update
sudo apt -y install build-essential autoconf automake cmake  libtool git checkinstall nasm yasm libass-dev libfreetype6-dev libsdl2-dev libtool libva-dev libvdpau-dev libvorbis-dev libxcb1-dev libxcb-shm0-dev libxcb-xfixes0-dev pkg-config texinfo wget zlib1g-dev libchromaprint-dev frei0r-plugins-dev ladspa-sdk libcaca-dev libcdio-paranoia-dev libcodec2-dev libfontconfig1-dev libfreetype6-dev libfribidi-dev libgme-dev libgsm1-dev libjack-dev libmodplug-dev libmp3lame-dev libopencore-amrnb-dev libopencore-amrwb-dev libopenjp2-7-dev  libopus-dev libpulse-dev librsvg2-dev librubberband-dev librtmp-dev libshine-dev libsmbclient-dev libsnappy-dev libsoxr-dev libspeex-dev libssh-dev libtesseract-dev libtheora-dev libtwolame-dev libv4l-dev libvo-amrwbenc-dev libvpx-dev libwavpack-dev libwebp-dev libx264-dev libx265-dev libxvidcore-dev libxml2-dev libzmq3-dev libzvbi-dev liblilv-dev libopenal-dev gnutls-dev libfdk-aac-dev
wget https://github.com/FFmpeg/FFmpeg/archive/n4.1.3.tar.gz
tar -xvf n4.1.3.tar.gz
cd FFmpeg-n4.1.3
./configure --disable-shared --enable-static --enable-pthreads --enable-nonfree --enable-version3 --enable-hardcoded-tables --enable-avresample --enable-ffplay --enable-gpl --enable-libmp3lame --enable-libopus --enable-librubberband --enable-libsnappy  --enable-libtheora --enable-libvorbis --enable-libvpx --enable-libx264 --enable-libx265 --enable-libxvid --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-librtmp --enable-libspeex  --disable-libjack --disable-indev=jack --enable-libsoxr --enable-openssl --enable-runtime-cpudetect --extra-version=patrickz
make && make install
```

### Running the web page
 ```ssh
 git clone https://github.com/jackbmccarthy/streamForwarder.git
 cd streamForwarder && npm install && npm run-script build
 sudo node server.js
 ```
 
 ## Disclaimer
 This application was created to be used for fun, and free. With the intention that you launch the server while you are streaming, and then turn off the server afterwards. If you need something more reliable and secure, please either contribute to the application, or use a commercially available software. 
