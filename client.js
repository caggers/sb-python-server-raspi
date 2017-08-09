/*global WebSocket, $, window, console, alert, Blob, saveAs*/
"use strict";

/**
 * Function calls across the background TCP socket. Uses JSON RPC + a queue.
 */
var client = {
    queue: {},
    led_on: false,
    led_neo: 0,
    disco: false,
    servo_val: 0,
    temp_val: 0,

    // Connects to Python through the websocket
    connect: function (port) {
        var self = this;
        this.socket = new WebSocket("ws://" + window.location.hostname + ":" + port + "/websocket");

        this.socket.onopen = function () {
            console.log("Connected!");
        };

        this.socket.onmessage = function (messageEvent) {
            var router, current, updated, jsonRpc;

            jsonRpc = JSON.parse(messageEvent.data);
            router = self.queue[jsonRpc.id];
            delete self.queue[jsonRpc.id];
            self.result = jsonRpc.result;

            // Alert on error
            if (jsonRpc.error) {
                alert(jsonRpc.result);
                
            } else {
               
            }
        };
    },

    // Generates a unique identifier for request ids
    // Code from http://stackoverflow.com/questions/105034/
    // how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    uuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },

    // Sends a message to toggle the LED
    toggle_led: function () {
        this.led_on = !this.led_on;
        var uuid = this.uuid();
        this.socket.send(JSON.stringify({method: "toggle_led", id: uuid, params: {on: this.led_on}}));
        this.queue[uuid] = "toggle_led";
    },
    
    toggle_neo: function () {
        this.led_neo = document.getElementById('neo_val').value
        var uuid = this.uuid();
        this.socket.send(JSON.stringify({method: "toggle_neo", id: uuid, params: {val: this.led_neo}}));
        this.queue[uuid] = "toggle_neo";
        console.log(this.led_neo);
    },
    
    toggle_disco_party: function () {
        this.disco = !this.disco
        var uuid = this.uuid();
        this.socket.send(JSON.stringify({method: "toggle_disco_party", id: uuid, params: {val: this.disco}}));
        this.queue[uuid] = "toggle_disco_party";
        console.log("Disco Party Toggled");
    },
    
    move_servo: function () {
        this.servo_val = document.getElementById('servo_val').value
        var uuid = this.uuid();
        this.socket.send(JSON.stringify({method: "move_servo", id: uuid, params: {val: this.servo_val}}));
        this.queue[uuid] = "move_servo";
        console.log("move_servo");
    },
    
    change_temp: function () {
        this.temp_val = document.getElementById('temp_val').value
        var uuid = this.uuid();
        this.socket.send(JSON.stringify({method: "change_temp", id: uuid, params: {val: this.temp_val}}));
        this.queue[uuid] = "change_temp";
        console.log("change_temp");
    }
};

