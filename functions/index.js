// index.js using V2 syntax

// Import the Firestore trigger specifically from the v2 module
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Triggered when a new document is created in the 'chat/{messageId}' path.
 * V2 functions are generally more performant and cost-effective.
 */
exports.sendMessageNotification = onDocumentCreated('chat/{messageId}', (event) => {
    // V2 uses event.data to get the snapshot
    const snapshot = event.data; 
    
    // Safety check for snapshot data
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const messageData = snapshot.data();
    
    const notification = {
      // Notification properties (user-facing text)
      notification: {
        title: messageData['username'] || 'New Message',
        body: messageData['text'] || 'You have a new message',
      },
      // Data payload (used by the app for custom actions)
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      // Target: Topic-based delivery
      topic: 'chat'
    };

    // V2 functions handle returning the promise directly
    return admin.messaging().send(notification)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
});