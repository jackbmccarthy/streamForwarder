FROM ubuntu:xenial-20191024
RUN apt update
RUN apt -y install build-essential autoconf automake cmake  libtool git checkinstall nasm yasm libass-dev libfreetype6-dev libsdl2-dev libtool libva-dev libvdpau-dev libvorbis-dev libxcb1-dev libxcb-shm0-dev libxcb-xfixes0-dev pkg-config texinfo wget zlib1g-dev libchromaprint-dev frei0r-plugins-dev ladspa-sdk libcaca-dev libcdio-paranoia-dev libcodec2-dev libfontconfig1-dev libfreetype6-dev libfribidi-dev libgme-dev libgsm1-dev libjack-dev libmodplug-dev libmp3lame-dev libopencore-amrnb-dev libopencore-amrwb-dev libopenjp2-7-dev  libopus-dev libpulse-dev librsvg2-dev librubberband-dev librtmp-dev libshine-dev libsmbclient-dev libsnappy-dev libsoxr-dev libspeex-dev libssh-dev libtesseract-dev libtheora-dev libtwolame-dev libv4l-dev libvo-amrwbenc-dev libvpx-dev libwavpack-dev libwebp-dev libx264-dev libx265-dev libxvidcore-dev libxml2-dev libzmq3-dev libzvbi-dev liblilv-dev libopenal-dev gnutls-dev libfdk-aac-dev
# libmysofa-dev libopenmpt-dev opencl-dev
RUN mkdir /app
RUN git clone https://github.com/FFmpeg/FFmpeg.git
RUN /FFmpeg/configure --disable-shared --enable-static --enable-pthreads --enable-nonfree --enable-version3 --enable-hardcoded-tables --enable-avresample --enable-ffplay --enable-gpl --enable-libmp3lame --enable-libopus --enable-librubberband --enable-libsnappy  --enable-libtheora --enable-libvorbis --enable-libvpx --enable-libx264 --enable-libx265 --enable-libxvid --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-librtmp --enable-libspeex  --disable-libjack --disable-indev=jack --enable-libsoxr --enable-openssl --enable-runtime-cpudetect --extra-version=patrickz
RUN make && make install

#RUN git clone https://github.com/jackbmccarthy/streamForwarder.git
COPY ../streamForwarder /app
RUN cd /app/streamForwarder && npm install && npm run-script build && cd ..
ENTRYPOINT node server.js
