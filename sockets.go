package main

import (
	"encoding/json"

	"github.com/globalsign/mgo/bson"
	"github.com/googollee/go-socket.io"
	"log"
)

func handleConnection(so socketio.Socket) {
	so.On("get_chats", func(request string) {
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
			id := bson.NewObjectId()
			log.Println("ID", id)
			chat := Chat{Users: []string{"101768425906179634408"}, ID: id, Name: "Go club"}
			db.DB("chatapp").C("chats").Insert(chat)
			chats = append(chats, chat)
		}

		if err := so.Join("chat"); err != nil {
			log.Println("err(join)", err)
		}

		so.Emit("get_chats", chats)
	})

	so.On("chat", func(request string) {

		r := SocketChatRequest{}
		err := json.Unmarshal([]byte(request), &r)
		if err != nil {
			panic(err)
		}

		user, err := getUserClaims("Bearer " + r.Token)

		if err != nil {
			log.Println("err (claims): ", err)
			log.Println("tkn", r.Token)
		}

		userID := getUserID(user["sub"])

		chat := Chat{}

		db.DB("chatapp").C("chats").Find(bson.M{"$and": []bson.M{{"_id": bson.ObjectIdHex(r.Chat)}, {"users": bson.M{"$in": []string{userID}}}}}).One(&chat)

		if len(chat.Users) == 0 {
			log.Println("Not found")
			return
		}

		msg := Message{}
		err = json.Unmarshal([]byte(r.Payload), &msg)
		if err != nil {
			panic(err)
		}

		msg.ID = bson.NewObjectId()
		msg.User.Id = userID
		msg.User.Name = user["name"]
		msg.User.Nick = user["nickname"]
		msg.User.Picture = user["picture"]

		id := bson.ObjectIdHex(r.Chat)

		if err := db.DB("chatapp").C("chats").UpdateId(id, bson.M{"$push": bson.M{"messages": msg}}); err != nil {
			log.Println("Update err ", err)
			return
		}

		log.Println("broadcasting to", so.Rooms())

		if err := so.Emit("chat", BroadcastMessage{msg, r.Chat}); err != nil {
			log.Println("err(broadcasting)", err)
		}
	})

}
