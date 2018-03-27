package main

import (
	"github.com/globalsign/mgo/bson"
)

type Message struct {
	ID bson.ObjectId `json:"id" bson:"_id"`
	// User    bson.ObjectId `json:"user" bson:"user"`
	Message string `json:"message" bson:"message"`
}
