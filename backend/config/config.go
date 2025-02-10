package config

import (
	"context"
	"errors"
	"io/fs"
	"log"
	"os"
	"regexp"

	"github.com/spf13/viper"
)

type Config struct {
	// Postgres  Postgres
	// Redis     Redis
	Server Server
	// Jwt       Jwt
}

func LoadConfig(ctx context.Context) *Config {

	var cfg Config

	path, err := os.Getwd() // get curent path
	if err != nil {
		log.Fatalf("fatal error unmarshalling config: \n %s ", err)
	}

	// get the root path of the project
	// this allows us to call the config file from any directory
	// notably, the controller integration tests
	loop := 4
	var re = regexp.MustCompile(`/[^/]*?$`)
	for loop > 0 {
		_, err := os.Stat(path + "/config")
		if errors.Is(err, fs.ErrNotExist) {
			path = re.ReplaceAllString(path, "")
		} else {
			break
		}
		loop -= 1
	}

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(path + "/config") // path to look for the config file in
	viper.AutomaticEnv()                  // read in environment variables that match

	err = viper.ReadInConfig()
	if err != nil {
		switch err.(type) {
		case viper.ConfigFileNotFoundError:
			log.Println("No config file found. Using defaults and environment variables")
		case viper.ConfigParseError:
			log.Fatalln("Error parsing config file. Please make sure the config file is well formed")
			panic(err)
		default:
			log.Fatalf("fatal error loading config file: \n %s ", err)
			panic(err)
		}
	}
	viper.BindEnv("Server.Host", "SERVER_HOST")
	viper.BindEnv("Server.Port", "SERVER_PORT")

	if err := viper.Unmarshal(&cfg); err != nil {
		log.Fatalf("fatal error unmarshalling config: \n %s ", err)

	}

	return &cfg
}
