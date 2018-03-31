package main

import (
	"encoding/json"
	// "github.com/davecgh/go-spew/spew"
	"github.com/globalsign/mgo/bson"
	"github.com/kataras/iris/websocket"
	"log"
)

func handleConnection(c websocket.Connection) {
	// Read events from browser
	chatSendHandler(c)

}

func chatSendHandler(c websocket.Connection) {
	c.On("chat", func(basicRequest string) {
		// Unmarshal message into obj
		message := Message{}
		r := SocketRequest{}

		err := json.Unmarshal([]byte(basicRequest), &r)
		if err != nil {
			panic(err)
		}

		err = json.Unmarshal([]byte(r.Payload), &message)
		if err != nil {
			panic(err)
		}

		// Generate new ID
		message.ID = bson.NewObjectId()

		// Get actual user from JWT
		claims, err := getUserClaims(r.Token)
		if err != nil {
			c.Emit("err", err)
			return
		}

		// Some tweak with User`s id
		message.User.Id = getUserID(claims["sub"])

		// Assign all stuff
		message.User.Name = claims["name"]
		message.User.Nick = claims["nickname"]
		message.User.Picture = claims["picture"]

		b, err := json.Marshal(message)
		if err != nil {
			panic(err)
		}

		// Emit msg to all
		c.To(websocket.All).Emit("chat", b)

		if err := db.DB("chatapp").C("message").Insert(message); err != nil {
			panic(err)
		}
	})

	c.On("get_chats", func(request string) {

		r := SocketRequest{}
		err := json.Unmarshal([]byte(request), &r)

		if err != nil {
			panic(err)
		}

		user, err := getUserClaims("Bearer " + r.Token)

		if err != nil {
			log.Println("err (claims): ", err)
			log.Println("tkn", r.Token)
		}

		var chats []Chat

		db.DB("chatapp").C("chats").Find(bson.M{"users": bson.M{"$in": []string{getUserID(user["sub"])}}}).All(&chats)

		if len(chats) == 0 {
			log.Println("CREATING NEW TEST CHAT")
			chat := Chat{Users: []string{"101768425906179634408"}, ID: bson.NewObjectId(), Name: "test_chat"}
			db.DB("chatapp").C("chats").Insert(chat)
			chats = append(chats, chat)
		}
		c.Emit("get_chats", chats)
	})
}
