package main

import (
	"github.com/globalsign/mgo"

	"github.com/kataras/iris"

	"github.com/auth0-community/auth0"
	"github.com/googollee/go-socket.io"
	"gopkg.in/square/go-jose.v2"

	"log"
	"net/http"
)

var db, dbErr = mgo.Dial("localhost")

// ____________CONFIG____________
var (
	client = auth0.NewJWKClient(auth0.JWKClientOptions{URI: "https://mussel.auth0.com/.well-known/jwks.json"}, nil)

	audience = []string{"https://mussel.auth0.com/api/v2/"}

	configuration = auth0.NewConfiguration(client, audience, "https://mussel.auth0.com/", jose.RS256)
	validator     = auth0.NewValidator(configuration, nil)
)

// ______________________________

func main() {
	app := iris.New()

	db.DB("chatapp").DropDatabase()

	if dbErr != nil {
		panic(dbErr)
	}

	app.RegisterView(iris.HTML("./templates", ".html")) // select the html engine to serve templates

	app.Get("/", func(ctx iris.Context) {
		ctx.Text("Api here")

	})

	// setup Websocket (app)

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.Println("connecting")
		// Get all chats

		handleConnection(so)

		so.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})

	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	handleMessages(app)
	handleTest(app)

	http.Handle("/socket.io/", server)
	log.Fatal(http.ListenAndServe(":8000", nil))

	//app.Any("/socket.io/{p:path}", iris.FromStd(server))
	//app.Run(iris.Addr(":8000"))
}
