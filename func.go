package main

import (
	"net/http"
	"strings"
)

// Extracts user from JWT string
func getUserClaims(user string) (map[string]string, error) {
	fakeM := http.Header{}
	fakeM.Add("Authorization", user)

	fakeR := http.Request{Header: fakeM}

	token, err := validator.ValidateRequest(&fakeR)

	if err == nil {
		claims := map[string]string{}
		err = validator.Claims(&fakeR, token, &claims)
		if err != nil {
			return claims, nil
		}
		return nil, err
	}
	return nil, err
}

// Extracts user from request
func getUserClaimsRequest(r *http.Request) (map[string]string, error) {
	token, err := validator.ValidateRequest(r)
	if err == nil {
		claims := map[string]string{}
		err = validator.Claims(r, token, &claims)
		if err != nil {
			return claims, nil
		}
		return nil, err
	}
	return nil, err
}

// Usually we have just a user id string, but often it comes in that form: "auth_provider|id" that's why we need it
func getUserID(s string) string {
	idArr := strings.Split(s, "|")

	if len(idArr) > 1 {
		return idArr[len(idArr)-1]
	} else {
		return idArr[0]
	}
}
