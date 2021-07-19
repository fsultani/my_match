const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const credentials = require('../credentials.json');

const OAuth2 = google.auth.OAuth2;
const clientId = credentials.GOOGLE_CLIENT_ID;
const clientSecret = credentials.GOOGLE_CLIENT_SECRET;
const refreshToken = credentials.GOOGLE_REFRESH_TOKEN;
const redirectUri = 'https://developers.google.com/oauthplayground';
const accessType = 'offline'; /* https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient */

const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri, accessType);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

/* Use OAuth2 */
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: 'freelancingfarid@gmail.com',
//     clientId,
//     clientSecret,
//     refreshToken,
//   },
// });

/*
  Use less secure app access - https://myaccount.google.com/u/1/lesssecureapps?pli=1&rapt=AEjHL4PE22mGXZ-8-77W8ARNRMIISJNJB9a7QRywN4DFVmDBqVMDnUWmLIsJ6CA5F8C_rwgkzxoJzFfydhYuXM9zDffDGkyesA
*/
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'freelancingfarid@gmail.com',
    pass: 'tispEj-myjji7-qezsus',
  },
});

module.exports = sendEmail = (address, subject, body, callback) => {
  const mailOptions = {
    from: `"My Match Admin" <freelancingfarid@gmail.com>`, /* To prevent emails from going to spam */
    to: address,
    subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(`err:\n`, err);
      throw new Error(err);
    } else {
      // console.log(`info:\n`, info);
      return callback();
    }
  });
};
