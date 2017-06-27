import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular'
import * as global from './global';
import * as io from "socket.io-client";
import { Authentication } from './authentication';
import { AuthUserInfo, SocketEvents }  from '../models/models';

@Injectable()
export class SocketIO {
  private socket: SocketIOClient.Socket = null;
  private auth: AuthUserInfo;
  public socketEvents: SocketEvents;

  constructor(public authentication: Authentication, public events: Events) {
    this.auth = this.authentication.getCurrentUser();
    this.socketEvents = {
        subscribe: "subscribe",
        unsubscribe: "unsubscribe",
        userPlacedNewOrder: "user-placed-new-order",
        incomingNewOrder: "incoming-new-order",
        alertUserProcessingOrder: "alert-user-processing-order",
        locationIsProcessingOrder: "location-is-processing-order"
    }
  }

    public connect(room = null) {
        if (!this.socket) {
            this.socket = io.connect(global.SERVER_URL_NODE, { reconnection: true });

            if (room) this.emit(this.socketEvents.subscribe, { room });
        }
    }

    /*
     on logout/hard close
    */
    public disconnect() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
        }
    }

    public on(socketEvent: string) {
        this.socket.on(socketEvent, (data) => {
            this.publish(socketEvent, data);
        });
    }

    public emit(eventName: string, data: any) {
        console.log("emitting: ", eventName);
        this.socket.emit(eventName, data);
    }

    public publish(event: string, data) {
        this.events.publish(event, data);
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