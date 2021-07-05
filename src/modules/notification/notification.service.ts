import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  public async sendNotificationToDevice(
    fcmToken: string,
    title: string,
    body: string,
  ) {
    try {
      console.log(fcmToken);
      const payload = {
        notification: {
          title: title,
          body: body,
        },
      };
      const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24 * 7,
      };
      await admin
        .messaging()
        .sendToDevice(fcmToken, payload, options)
        .then(() => {
          console.log('Notification has been sent');
        });
    } catch (error) {
      console.log(error);
    }
  }
}
