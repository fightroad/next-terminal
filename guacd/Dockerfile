FROM guacamole/guacd:1.6.0

LABEL MAINTAINER="helloworld1024@foxmail.com"

# 官方镜像默认以 guacd 用户运行，装字体需临时提权
USER root

COPY ./guacd/fonts/Menlo-Regular.ttf /usr/share/fonts/
COPY ./guacd/fonts/SourceHanSansCN-Regular.otf /usr/share/fonts/

RUN apk add --no-cache fontconfig \
    && fc-cache -f

USER guacd
