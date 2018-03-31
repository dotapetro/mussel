package main

import (
	"github.com/globalsign/mgo/bson"
)

type Message struct {
	ID      bson.ObjectId `json:"id" bson:"_id"`
	User    User          `json:"user" bson:"user"`
	Message string        `json:"message" bson:"message"`
}

type Chat struct {
	ID       bson.ObjectId `json:"id" bson:"_id"`
	Name     string        `json:"name" bson:"name"`
	Users    []string      `json:"users" bson:"users"`
	Messages []Message     `json:"messages" bson:"messages"`
}

type User struct {
	Picture string `json:"picture" bson:"picture"`
	Id      string `json:"id" bson:"id"`
	Name    string `json:"name" bson:"name"`
	Nick    string `json:"nickname" bson:"nickname"`
}

type SocketRequest struct {
	Token   string `json:"token" bson:"token"`
	Payload string `json:"payload" bson:"payload"`
}
