package main

import (
	"encoding/json"
	"fmt"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"

	"github.com/kataras/iris"
	"github.com/kataras/iris/websocket"

	"github.com/auth0-community/auth0"
	"github.com/dgrijalva/jwt-go"
	jwtmiddleware "github.com/iris-contrib/middleware/jwt"
	jose "gopkg.in/square/go-jose.v2"
)

var db, dbErr = mgo.Dial("localhost")

var mySigningKey = []byte("secret")

func main() {
	app := iris.New()

	db.DB("chatapp").DropDatabase()

	if dbErr != nil {
		panic(dbErr)
	}

	app.RegisterView(iris.HTML("./templates", ".html")) // select the html engine to serve templates

	app.Get("/", func(ctx iris.Context) {
		/*
			ctx.ViewData("messages", msg)
			ctx.View("client.html")
		*/
		ctx.ServeFile("websockets.html", false)

	})

	setupWebsocket(app)
	handleMessages(app)
	handleChat(app)

	var jwtMiddleware = jwtmiddleware.New(jwtmiddleware.Config{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return mySigningKey, nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})

	app.Use(jwtMiddleware.Serve)

	// x2
	// http://localhost:8080
	// http://localhost:8080
	// write something, press submit, see the result.
	app.Run(iris.Addr(":8000"))
}

func setupWebsocket(app *iris.Application) {
	// create our echo websocket server
	ws := websocket.New(websocket.Config{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	})
	ws.OnConnection(handleConnection)

	// register the server on an endpoint.
	// see the inline javascript code in the websockets.html, this endpoint is used to connect to the server.
	app.Get("/echo", ws.Handler())

	// serve the javascript built'n client-side library,
	// see weboskcets.html script tags, this path is used.
	app.Any("/iris-ws.js", func(ctx iris.Context) {
		ctx.Write(websocket.ClientSource)
	})
}

func handleConnection(c websocket.Connection) {
	// Read events from browser
	c.On("chat", func(request string) {
		// Print the message to the console, c.Context() is the iris's http context.

		fmt.Printf("request: %s\n", request)

		// Write message back to the client message owner with:
		// c.Emit("chat", msg)
		// Write message to all except this client with:

		message := Message{}
		err := json.Unmarshal([]byte(request), &message)
		if err != nil {
			panic(err)
		}
		message.ID = bson.NewObjectId()
		// spew.Dump(message)

		if err := db.DB("chatapp").C("message").Insert(&message); err != nil {
			panic(err)
		}
		c.To(websocket.All).Emit("chat", request)
	})
}

func handleMessages(app *iris.Application) {

	app.Get("/messages", func(c iris.Context) {
		var msg []Message
		db.DB("chatapp").C("message").Find(nil).All(&msg)
		c.Header("Access-Control-Allow-Origin", "*")
		c.JSON(msg)
	})
}

func handleChat(app *iris.Application) {

	app.Get("/chat/{id}", func(c iris.Context) {
		//id := c.Params().GetTrim("id")
		var msg []Message
		db.DB("chat").C("message").Find(nil).All(&msg)
		c.Header("Access-Control-Allow-Origin", "*")
		c.JSON(msg)
	})
}

func authMiddleware(ctx iris.Context) {
	secret := []byte("{YOUR-API-CLIENT-SECRET}")
	secretProvider := auth0.NewKeyProvider(secret)
	audience := []string{"{YOUR-AUTH0-API-AUDIENCE}"}

	configuration := auth0.NewConfiguration(secretProvider, audience, "https://{YOUR-AUTH0-DOMAIN}.auth0.com/", jose.HS256)
	validator := auth0.NewValidator(configuration, nil)

	token, err := validator.ValidateRequest(ctx.Request())

	if err != nil {
		fmt.Println(err)
		fmt.Println("Token is not valid:", token)
		ctx.StatusCode(iris.StatusUnauthorized)
		ctx.Write([]byte("Unauthorized"))

	} else {
		ctx.Next()
	}

}
