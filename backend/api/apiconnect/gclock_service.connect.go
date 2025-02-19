// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: api/gclock_service.proto

package apiconnect

import (
	connect "connectrpc.com/connect"
	context "context"
	errors "errors"
	api "github.com/bhbdev/gclock/api"
	http "net/http"
	strings "strings"
)

// This is a compile-time assertion to ensure that this generated file and the connect package are
// compatible. If you get a compiler error that this constant is not defined, this code was
// generated with a version of connect newer than the one compiled into your binary. You can fix the
// problem by either regenerating this code with an older version of connect or updating the connect
// version compiled into your binary.
const _ = connect.IsAtLeastVersion1_13_0

const (
	// GClockServiceName is the fully-qualified name of the GClockService service.
	GClockServiceName = "gclock.api.GClockService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// GClockServiceGetTimeProcedure is the fully-qualified name of the GClockService's GetTime RPC.
	GClockServiceGetTimeProcedure = "/gclock.api.GClockService/GetTime"
)

// These variables are the protoreflect.Descriptor objects for the RPCs defined in this package.
var (
	gClockServiceServiceDescriptor       = api.File_api_gclock_service_proto.Services().ByName("GClockService")
	gClockServiceGetTimeMethodDescriptor = gClockServiceServiceDescriptor.Methods().ByName("GetTime")
)

// GClockServiceClient is a client for the gclock.api.GClockService service.
type GClockServiceClient interface {
	GetTime(context.Context, *connect.Request[api.GetTimeRequest]) (*connect.Response[api.GetTimeResponse], error)
}

// NewGClockServiceClient constructs a client for the gclock.api.GClockService service. By default,
// it uses the Connect protocol with the binary Protobuf Codec, asks for gzipped responses, and
// sends uncompressed requests. To use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC()
// or connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewGClockServiceClient(httpClient connect.HTTPClient, baseURL string, opts ...connect.ClientOption) GClockServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	return &gClockServiceClient{
		getTime: connect.NewClient[api.GetTimeRequest, api.GetTimeResponse](
			httpClient,
			baseURL+GClockServiceGetTimeProcedure,
			connect.WithSchema(gClockServiceGetTimeMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
	}
}

// gClockServiceClient implements GClockServiceClient.
type gClockServiceClient struct {
	getTime *connect.Client[api.GetTimeRequest, api.GetTimeResponse]
}

// GetTime calls gclock.api.GClockService.GetTime.
func (c *gClockServiceClient) GetTime(ctx context.Context, req *connect.Request[api.GetTimeRequest]) (*connect.Response[api.GetTimeResponse], error) {
	return c.getTime.CallUnary(ctx, req)
}

// GClockServiceHandler is an implementation of the gclock.api.GClockService service.
type GClockServiceHandler interface {
	GetTime(context.Context, *connect.Request[api.GetTimeRequest]) (*connect.Response[api.GetTimeResponse], error)
}

// NewGClockServiceHandler builds an HTTP handler from the service implementation. It returns the
// path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewGClockServiceHandler(svc GClockServiceHandler, opts ...connect.HandlerOption) (string, http.Handler) {
	gClockServiceGetTimeHandler := connect.NewUnaryHandler(
		GClockServiceGetTimeProcedure,
		svc.GetTime,
		connect.WithSchema(gClockServiceGetTimeMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	return "/gclock.api.GClockService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case GClockServiceGetTimeProcedure:
			gClockServiceGetTimeHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedGClockServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedGClockServiceHandler struct{}

func (UnimplementedGClockServiceHandler) GetTime(context.Context, *connect.Request[api.GetTimeRequest]) (*connect.Response[api.GetTimeResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("gclock.api.GClockService.GetTime is not implemented"))
}
