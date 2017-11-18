import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular'
import { CONSTANT } from '../constants/constants';
import * as io from "socket.io-client";
import { Authentication } from './authentication';
import { AuthUserInfo, SocketEvents }  from '../interfaces/interfaces';

/***
 * This service is a wrapper class around the socket.io library
 */
@Injectable()
export class SocketIO {
  private socket: SocketIOClient.Socket = null;
  private auth: AuthUserInfo;
  public socketEvents: SocketEvents;
  public socketOpts: any;

  constructor(public authentication: Authentication, public events: Events) {
    this.auth = this.authentication.getCurrentUser();
    this.socketOpts =  { reconnection: true, reconnectionAttempts: 10};
  }

    public connect(): SocketIO {
        console.log("this.socket: ", this.socket);
        if (!this.socket) {
            console.log("connecting...");
            this.socket = io.connect(CONSTANT.SERVER_URL_NODE, this.socketOpts);
        }
        return this;
    }

    public subscribe(room: string): SocketIO {
        if (room) this.emit(CONSTANT.SOCKET_EVENTS.subscribe, { room });

        console.log("subscribing...");

        return this;

        /* subscriber pattern
        this.subscriber$ = this.on(this.events.incomingNewOrder).subscribe((data) => {
            // cordova sound, vibrate
        });
        */
    }

    public unsubscribe(room): SocketIO {
        if (room) this.emit(CONSTANT.SOCKET_EVENTS.unsubscribe, { room })
        return this;
    }

    /*
     on logout/hard close
    */
    public disconnect() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public on(socketEvent: string) {
        if (this.socket) {
            this.socket.on(socketEvent, (data) => {
                this.publish(socketEvent, data);
            });
        }
    }

    public emit(eventName: string, data: any) {
        console.log("emitting: ", eventName);
        if (this.socket) this.socket.emit(eventName, data);
    }

    public publish(event: string, data) {
        if (this.socket) this.events.publish(event, data);
    }

    /*  observable pattern instead of using Ionic Events
    public on(eventName: string) {
        let observable = new Observable(observer => {
            this.socket.on(eventName, (data) => {
                observer.next();
            });

            return () => {
                // do i need this?
                if (this.socket) this.socket.disconnect();
            }
        });
        return observable;
    }
    */
}