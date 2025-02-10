package server

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/bhbdev/gclock/api/apiconnect"
	"github.com/bhbdev/gclock/config"
	"github.com/bhbdev/gclock/service"

	connectcors "connectrpc.com/cors"
	"connectrpc.com/grpcreflect"
	"github.com/rs/cors"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func GrpcClockServer(cfg *config.Config) {

	log.Printf("Starting GClock 🕓 server on port %s", cfg.Server.Port)

	mux := http.NewServeMux()

	path, handler := apiconnect.NewGClockServiceHandler(service.NewGClockService())
	handler = withCORS(cfg, handler)
	mux.Handle(path, handler)

	reflector := grpcreflect.NewStaticReflector(
		apiconnect.GClockServiceName,
	)
	mux.Handle(grpcreflect.NewHandlerV1(reflector))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(reflector))

	go func() {
		http.ListenAndServe(
			cfg.Server.Host+":"+cfg.Server.Port,
			h2c.NewHandler(mux, &http2.Server{}),
		)
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	i := <-quit
	log.Printf("received signal: %v", i)

	log.Printf("server exiting")

}

// withCORS adds CORS support to a Connect HTTP handler.
func withCORS(cfg *config.Config, connectHandler http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   cfg.Server.Cors.AllowedHeaders, // replace with your domain
		AllowedMethods:   connectcors.AllowedMethods(),
		AllowedHeaders:   append(connectcors.AllowedHeaders(), "Authorization", "Connect-Protocol-Version"),
		ExposedHeaders:   connectcors.ExposedHeaders(),
		AllowCredentials: true,
		MaxAge:           7200, // 2 hours in seconds
		Debug:            true,
	})
	c.Log = log.New(os.Stdout, "cors: ", log.LstdFlags)
	return c.Handler(connectHandler)
}
