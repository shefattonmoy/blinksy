const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Alternative syntax - more explicit
exports.sendMessageNotification = functions.firestore
  .document('chat/{messageId}')
  .onCreate((snapshot, context) => {
    const messageData = snapshot.data();
    
    const notification = {
      notification: {
        title: messageData['username'] || 'New Message',
        body: messageData['text'] || 'You have a new message',
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      topic: 'chat'
    };

    return admin.messaging().send(notification)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      })
      .catch((error) => {
        console.log('Error sending message:', error);
        return null;
      });
  });