const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'freesms',
  description: 'Send free SMS messages for emergencies and more!',
  usage: '-freesms <phone_number> <message>',
  author: 'NicoDev',

  async execute(senderId, args, pageAccessToken) {
    // Extract the phone number and message from arguments
    const [phoneNumber, ...messageParts] = args;
    const message = messageParts.join(' ');

    // Validation
    if (!phoneNumber || !message) {
      return sendMessage(
        senderId,
        { text: 'Invalid usage. Use -freesms <phone_number> <message>' },
        pageAccessToken
      );
    }

    try {
      // Send request to the API
      const response = await axios.get(
        `https://api.kenliejugarap.com/freesmslbc/?number=${encodeURIComponent(
          phoneNumber
        )}&message=${encodeURIComponent(message)}`
      );

      // API response handling
      if (response.data.status === 'success') {
        return sendMessage(
          senderId,
          { text: `📤 | SMS sent successfully to ${phoneNumber}!\n\nMessage:\n${message}` },
          pageAccessToken
        );
      } else {
        return sendMessage(
          senderId,
          { text: `❌ | Failed to send SMS. Reason: ${response.data.message}` },
          pageAccessToken
        );
      }
    } catch (error) {
      return sendMessage(
        senderId,
        { text: '❌ | Error: Unable to send SMS. Please try again later.' },
        pageAccessToken
      );
    }
  },
};
