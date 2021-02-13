import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];

//   abstract onMessage(data: T['data'], message: Message): void;

  constructor(private _client: Stan) {}

  publish(data: T['data']) {
    this._client.publish(this.subject, JSON.stringify(data), ()=>{
        console.log('Event published');
        
    });

  }
}
