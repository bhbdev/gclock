# GClock

GClock is an example application using ConnectRPC, Go and React

![Screenshot](assets/screenshot-1.png)



## Setup

Install frontend dependencies
```
cd frontend;  npm install
```

## Startup
backend
```sh
cd backend
go run cmd/main.go run
```

frontend
```sh
cd frontend
npm run dev
```


## Misc

The backend provides server reflection on the gRPC service.

You can use Postman, grpcui.

```sh
grpcui --plaintext localhost:8080
```

Or grpcurl for example
```sh
grpcurl -d '{"timezone":"EST"}' -plaintext localhost:8080 gclock.api.GClockService.GetTime

---
Output:
{
  "currentTime": "10:01:14",
  "currentZone": "EST (-5:00)",
  "utcOffset": "-05:00"
}
```