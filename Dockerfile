FROM golang:alpine as builder

ENV GO111MODULE=on
ENV GOPROXY=https://proxy.golang.org,direct

WORKDIR /app

COPY . .

RUN go mod tidy
RUN sh get_arch.sh
RUN echo "Hello, my CPU architecture is $(uname -m)"
RUN cp -r /app/web/build /app/server/resource/
RUN go env;CGO_ENABLED=0 GOOS=linux GOARCH=$ARCH go build -ldflags '-s -w' -o next-terminal main.go

FROM alpine:3.20

LABEL MAINTAINER="helloworld1024@foxmail.com"

ENV TZ=Asia/Shanghai
ENV DB=sqlite
ENV SQLITE_FILE='./data/sqlite/next-terminal.db'
ENV SERVER_PORT=8088
ENV SERVER_ADDR=0.0.0.0:$SERVER_PORT
ENV SSHD_PORT=8089
ENV SSHD_ADDR=0.0.0.0:$SSHD_PORT

WORKDIR /usr/local/next-terminal
RUN touch config.yml

COPY --from=builder /app/next-terminal ./
COPY --from=builder /app/LICENSE ./

EXPOSE $SERVER_PORT $SSHD_PORT

# 使用官方 Alpine 源，避免 GitHub Actions 海外 runner 访问国内镜像失败
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone

ENTRYPOINT ./next-terminal
