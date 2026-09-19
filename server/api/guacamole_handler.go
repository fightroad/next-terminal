package api

import (
	"context"
	"encoding/base64"
	"strconv"

	"next-terminal/server/common/guacamole"
	"next-terminal/server/global/session"
)

type GuacamoleHandler struct {
	sess   *session.Session
	tunnel *guacamole.Tunnel
	ctx    context.Context
	cancel context.CancelFunc
}

func NewGuacamoleHandler(sess *session.Session, tunnel *guacamole.Tunnel) *GuacamoleHandler {
	ctx, cancel := context.WithCancel(context.Background())
	return &GuacamoleHandler{
		sess:   sess,
		tunnel: tunnel,
		ctx:    ctx,
		cancel: cancel,
	}
}

func (r GuacamoleHandler) Start() {
	go func() {
		for {
			select {
			case <-r.ctx.Done():
				return
			default:
				instruction, err := r.tunnel.Read()
				if err != nil {
					r.writeDisconnect(TunnelClosed, "远程连接已关闭")
					return
				}
				if len(instruction) == 0 {
					continue
				}
				if err = r.sess.Write(instruction); err != nil {
					return
				}
			}
		}
	}()
}

func (r GuacamoleHandler) Stop() {
	r.cancel()
}

func (r GuacamoleHandler) writeDisconnect(code int, reason string) {
	if r.sess == nil {
		return
	}
	encodeReason := base64.StdEncoding.EncodeToString([]byte(reason))
	errIns := guacamole.NewInstruction("error", encodeReason, strconv.Itoa(code))
	_ = r.sess.Write([]byte(errIns.String()))
	disconnect := guacamole.NewInstruction("disconnect")
	_ = r.sess.Write([]byte(disconnect.String()))
}
