package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/bhbdev/gclock/config"
	"github.com/bhbdev/gclock/server"
	"github.com/spf13/cobra"
)

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

var rootCmd = &cobra.Command{
	Use:   "gclock",
	Short: "gClock is a simple gRPC server that returns the current time",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Welcome to gClock. Use -h for help")
	},
}

func init() {
	run := &cobra.Command{
		Use:   "run",
		Short: "Run the gClock server",
		Run:   run,
	}
	rootCmd.AddCommand(run)
}

func run(cmd *cobra.Command, args []string) {

	// Create a context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg := config.LoadConfig(ctx)
	if cfg == nil {
		log.Fatal("Failed to load config 💀")
		os.Exit(1)
	}

	// channel for receiving termination signals
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		server.GrpcClockServer(cfg)
	}()

	// wait for termination signal
	select {
	case <-ctx.Done():
		wg.Wait()
	case <-sigs:
		cancel()
	}
}
