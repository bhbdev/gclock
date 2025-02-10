
proto:
	@echo "Generating gRPC clients..."
	buf build
	buf generate
