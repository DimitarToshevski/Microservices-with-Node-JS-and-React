import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;

  abstract onMessage(data: T['data'], message: Message): void;

  protected _ackWait = 5 * 1000;

  get subscriptionOption() {
    // setManualAckMode (acknowledgement) prevents the event from being destroyed after we receive it automatically
    // with it we have to manually tell nats that the event was processed
    // nats wait 30s to get notified that the event was successful and if it does not
    // it re-sends it to another member of a Queue group or re-sends to the same listener

    return this._client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this._ackWait)
      .setDurableName(this.queueGroupName);
  }

  constructor(private _client: Stan) {}

  listen() {
    const subscription = this._client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOption
    );

    subscription.on('message', (msg: Message) => {
      console.log('Message received', this.subject, this.queueGroupName);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}
