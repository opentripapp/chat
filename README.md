# Introduction

Documentation for OpenTrip Chat. We are using <a href='https://socket.io/'>Socket.Io</a> Library to communication.

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```


# Authentication

> To authorize, use this code:


```javascript

 const socket = io(`SOCKET_URL`,
         {
           query:`auth_token=TOKEN`,
           transports: ['websocket'],
           path:'/v2/chat'
         }
 );
```

> Make sure to replace `SOCKET_URL` with opentrip socket url and `TOKEN` with user access_token.

Socket URL : `https://socket.opentripapp.com/`

`ACCESS_TOKEN` is required to connect with socket, you can get access token after user login/register


<aside class="notice">
Read <a href='https://opentripapp.github.io/documentation/'>Api Documentation</a> to get <code>ACCESS_TOKEN</code>.
</aside>

# Event

## List Of Event to listen

### `connect` Listen event when socket success connect to server.

```javascript
socket.on('connect', function(){
  //connected to socket
});
```

### `success` When Success authorize user this event wil send user data

```javascript
socket.on('success', (data)=>{

});
```

> `success` data

```json
{
	"message": "success logged in!",
	"user": {
		"_id": "59c5c89665a538001088798f",
		"name": "arizal",
		"profile_picture": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c5c89665a538001088798f_dd4e289d20617520.jpg",
		"is_suspend": false,
		"id": "59c5c89665a538001088798f",
		"logged_in": true
	}
}
```

### `error` When error

```javascript
socket.on('error', (data)=>{

});
```

### `disconnect` When client disconnect to server

```javascript
socket.on('disconnect', ()=>{

});
```

### `online:${otherUserID}` listen user status

```javascript
let otherUserID = 'meowmeowmeow'
socket.on('online:${otherUserID}', (data)=>{

});
```

> `online:${otherUserID}` data

```json
{
  "online":true
}
```

### `start_chat_action_${chat._id}` listen user start typing

```javascript
let chat._id = 'meowmeowmeow'
socket.on('start_chat_action_${chat._id}', (data)=>{

});
```

> `start_chat_action_${chat._id}` data

```json
{
  "message":"Njayen is typing..."
}
```

### `end_chat_action_${chat._id}` listen user end typing

```javascript
let chat._id = 'meowmeowmeow'
socket.on('start_chat_action_${chat._id}', (data)=>{

});
```

> `end_chat_action_${chat._id}` data

```json
{
  "message":"Njayen is typing..."
}
```

### `new_message:${userId}` listening user new chat message

```javascript
let userID = 'meowmeowmeow'
socket.on('new_message:${userId}', (data)=>{

});
```

> `new_message:${userId}` data

```json
{
  ChatObject
}
```

### `room_new_message:${chatID}` listening room new message

```javascript
let chatID = 'meowmeowmeow'
socket.on('room_new_message:${chatID}', (data)=>{

});
```

> `room_new_message:${chatID}` data

```json
{
  MessageObject
}
```

### use this for remove event listener

```javascript
socket.off('event_name');
```


# Method

## List of Method

### `get_list_chat` getting list of chat

```javascript
let option = {
      offset:0,
      limit:20,
      sort:'-last_message_date'
      //type:'private',
      type:'group'
}

socket.emit('get_list_chat',option,(result)=>{
  //data result
});
```

> `get_list_chat` data

```json
{
	"error":false,
	"data":[
	  ChatObject,
	  ChatObject
	]
}
```

### `get_list_message` getting list of chat

```javascript
let option = {
      offset:0,
      limit:20,
      //sort:'-createdAt' default,
      chat_id:'meowmowmoeoeoe'
}

socket.emit('get_list_message',option,(result)=>{
  //data result
});
```

> `get_list_message` data

```json
{
	"error":false,
	"data":[
	  MessageObject,
	  MessageObject,
	  MessageObject
	]
}
```

### `join_room` joining chat room

```javascript
let name = '_id_of_ChatObject'
socket.emit('join_room', name)
```

### `leave_room` leaving chat room

```javascript
let name = '_id_of_ChatObject'
socket.emit('join_room', name)
```

### `get_user_status` getting user status

```javascript
socket.emit('get_user_status','_id_of_user',(result)=>{
  //data result
});
```

> `get_user_status` data

```json
{
	"error": false,
	"data": {
		"_id": "59c63a5fe0bc2400117a87fc",
		"status": {
			"last_active": "2018-02-20T03:56:40.145Z",
			"online": false
		}
	}
}
```

### `set_as_read` set chat already read

```javascript
let option = {
 chat_id:'_id_of_ChatObject'
}
socket.emit('set_as_read', option)
```

### `custom` Send custom emit event to listen

```javascript
let option = {
  event:'start_chat_action',
  message:'this is message'
}
socket.emit('custom',option);
```

### `send_message` Send message to chat room

```javascript
let option = {
  chat_id:'_id_of_chat_object',
  text:'this is message'
}
socket.emit('send_message',option,(result)=>{
  console.log(result);
});
```

## Object


### MessageObject

```json
{
	"__v": 0,
	"updatedAt": "2018-02-20T14:35:47.336Z",
	"createdAt": "2018-02-20T14:35:47.336Z",
	"from": {
		"_id": "59c5c89665a538001088798f",
		"name": "arizal",
		"profile_picture": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c5c89665a538001088798f_dd4e289d20617520.jpg"
	},
	"chat_id": "5a8c22946c9a219caca66ea5",
	"text": "ah",
	"_id": "5a8c32436c9a219caca66ead",
	"new_chat_members": [],
	"photo": [],
	"caption_entities": [],
	"entities": [],
	"read": false
}
```


### ChatObject
- Private Chat Object

```json
{
			"_id": "5a8c22946c9a219caca66ea5",
			"updatedAt": "2018-02-20T13:33:20.067Z",
			"createdAt": "2018-02-20T13:28:52.552Z",
			"type": "private",
			"all_members_are_administrators": true,
			"members": [
				{
					"user": {
						"_id": "59c63a5fe0bc2400117a87fc",
						"name": "Open Trip Official",
						"profile_picture": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c63a5fe0bc2400117a87fc_81bba8be06307fce.jpg"
					},
					"status": "member",
					"_id": "5a8c22946c9a219caca66ea7",
					"can_add_web_page_previews": true,
					"can_send_other_messages": true,
					"can_send_media_messages": true,
					"can_send_messages": true,
					"can_promote_members": true,
					"can_pin_messages": true,
					"can_restrict_members": true,
					"can_invite_users": true,
					"can_delete_messages": true,
					"can_edit_messages": true,
					"can_post_messages": true,
					"can_change_info": true,
					"can_be_edited": true,
					"unread_count": 1
				},
				{
					"user": {
						"_id": "59c5c89665a538001088798f",
						"name": "arizal",
						"profile_picture": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c5c89665a538001088798f_dd4e289d20617520.jpg"
					},
					"status": "creator",
					"_id": "5a8c22946c9a219caca66ea6",
					"can_add_web_page_previews": true,
					"can_send_other_messages": true,
					"can_send_media_messages": true,
					"can_send_messages": true,
					"can_promote_members": true,
					"can_pin_messages": true,
					"can_restrict_members": true,
					"can_invite_users": true,
					"can_delete_messages": true,
					"can_edit_messages": true,
					"can_post_messages": true,
					"can_change_info": true,
					"can_be_edited": true,
					"unread_count": 0
				}
			],
			"photo": {
				"small_file_url": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c63a5fe0bc2400117a87fc_81bba8be06307fce.jpg",
				"big_file_url": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c63a5fe0bc2400117a87fc_81bba8be06307fce.jpg"
			},
			"__v": 0,
			"last_message": "this is last message",
			"last_message_date": "2018-02-20T13:33:20.048Z",
			"from": {
				"_id": "59c63a5fe0bc2400117a87fc",
				"name": "Open Trip Official",
				"profile_picture": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c63a5fe0bc2400117a87fc_81bba8be06307fce.jpg"
			},
			"unread_count": 0
		}
```

- Group Chat Object

```json
{
			"_id": "5a8c2437b78b184ff43eb9b6",
			"updatedAt": "2018-02-20T13:28:52.552Z",
			"createdAt": "2018-02-20T13:28:52.552Z",
			"type": "group",
			"title": "this is group",
			"description": "desctiption of the group",
			"all_members_are_administrators": true,
			"invite_link": "9GVrn8dYHscJBUras",
			"members": [
				{
					"user": {
						"_id": "59c63a5fe0bc2400117a87fc",
						"name": "Open Trip Official",
						"profile_picture": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c63a5fe0bc2400117a87fc_81bba8be06307fce.jpg"
					},
					"status": "member",
					"_id": "5a8c22946c9a219caca66ea7",
					"can_add_web_page_previews": true,
					"can_send_other_messages": true,
					"can_send_media_messages": true,
					"can_send_messages": true,
					"can_promote_members": true,
					"can_pin_messages": true,
					"can_restrict_members": true,
					"can_invite_users": true,
					"can_delete_messages": true,
					"can_edit_messages": true,
					"can_post_messages": true,
					"can_change_info": true,
					"can_be_edited": true,
					"unread_count": 0
				},
				{
					"user": {
						"_id": "59c5c89665a538001088798f",
						"name": "arizal",
						"profile_picture": "https://s3-ap-southeast-1.amazonaws.com/opentrip-media/59c5c89665a538001088798f_dd4e289d20617520.jpg"
					},
					"status": "creator",
					"_id": "5a8c22946c9a219caca66ea6",
					"can_add_web_page_previews": true,
					"can_send_other_messages": true,
					"can_send_media_messages": true,
					"can_send_messages": true,
					"can_promote_members": true,
					"can_pin_messages": true,
					"can_restrict_members": true,
					"can_invite_users": true,
					"can_delete_messages": true,
					"can_edit_messages": true,
					"can_post_messages": true,
					"can_change_info": true,
					"can_be_edited": true,
					"unread_count": 0
				}
			],
			"photo": {
				"small_file_url": "image.url",
				"big_file_url": "image.url"
			},
			"last_message": "this is last message",
			"last_message_date": "2018-02-20T13:33:20.048Z",
			"__v": 0,
			"unread_count": 0
		}
```



