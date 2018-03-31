package main

import (
	"fmt"
	"github.com/kataras/iris"
)

func handleMessages(app *iris.Application) {

	app.Get("/messages", func(c iris.Context) {
		var msg []Message
		db.DB("chatapp").C("message").Find(nil).All(&msg)
		c.Header("Access-Control-Allow-Origin", "*")
		c.JSON(msg)
	})
}

func handleTest(app *iris.Application) {
	app.Get("/test", func(c iris.Context) {

		token, err := validator.ValidateRequest(c.Request())
		fmt.Println("all ok, tkn", token)
		if err != nil {
			fmt.Println(err)
			fmt.Println("Token is not valid:", token)
			// ctx.StatusCode(iris.StatusUnauthorized)
			// ctx.Write([]byte("Unauthorized"))

		}

		c.Text("test handler")
		c.StatusCode(200)
	})

}
