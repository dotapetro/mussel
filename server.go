package main

import (
	"github.com/globalsign/mgo"

	"github.com/kataras/iris"
	"github.com/kataras/iris/websocket"

	"github.com/auth0-community/auth0"
	jose "gopkg.in/square/go-jose.v2"
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

	setupWebsocket(app)
	handleMessages(app)
	handleTest(app)

	app.Run(iris.Addr(":8000"))
}

func setupWebsocket(app *iris.Application) {
	// create our echo websocket server
	ws := websocket.New(websocket.Config{
		ReadBufferSize:    2048,
		WriteBufferSize:   2048,
		MaxMessageSize:    2048,
		EnableCompression: true,
	})
	ws.OnConnection(handleConnection)

	// register the server on an endpoint.
	app.Get("/echo", ws.Handler())
}
