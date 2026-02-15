const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true untuk port 465, false untuk port lain
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, content) {
    // content adalah string JSON dari hasil query
    const message = {
      from: process.env.SMTP_USER,
      to: targetEmail,
      subject: 'Export Playlist OpenMusic',
      text: 'Terlampir hasil export playlist Anda dalam format JSON.',
      attachments: [
        {
          filename: 'playlist.json',
          content: content, // String JSON
          contentType: 'application/json',
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
