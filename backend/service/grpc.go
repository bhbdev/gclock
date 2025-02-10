package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"connectrpc.com/connect"
	"github.com/bhbdev/gclock/api"
	"github.com/bhbdev/gclock/api/apiconnect"
)

var _ apiconnect.GClockServiceHandler = (*GClockService)(nil)

type GClockService struct {
}

func NewGClockService() *GClockService {
	return &GClockService{}
}

// Implement the gClockServiceServer interface
func (s *GClockService) GetTime(
	ctx context.Context,
	req *connect.Request[api.GetTimeRequest],
) (*connect.Response[api.GetTimeResponse], error) {

	// Get the request message
	request := req.Msg

	// Get the current time
	t := time.Now()

	// if timezone is provided, load the location and convert the time
	if request.Timezone != "" {
		loc, err := time.LoadLocation(request.Timezone)
		if err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		log.Printf("Converting time to %s", request.Timezone)
		t = t.In(loc)
	}

	zone, offset := t.Zone()

	response := &api.GetTimeResponse{
		CurrentTime: t.Format("15:04:05"),
		CurrentZone: fmt.Sprintf("%s (%+02d:00)", zone, offset/3600),
		UtcOffset:   t.Format("-07:00"),
	}

	return connect.NewResponse(response), nil
}
