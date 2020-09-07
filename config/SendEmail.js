const mailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


const oauth2Client = new OAuth2(
    "619871118533-k7aiak6ljv383a3tsbel783bkacvi43k.apps.googleusercontent.com",
    "EPtFDN0mccRwsUofp0YtxFmE",
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: "1//044uOgw_PkGSOCgYIARAAGAQSNwF-L9IruW35SdCl_RUULvTAigoxovhCptKe7XCm_cWzVwm71EyTyEkTpvN0DuWmfA0u_UIO4Fo"
});

const accessToken = oauth2Client.getAccessToken();
let send_mail = mailer.createTransport({
    service: 'gmail',
    auth: {
        type: "OAuth2",
        user: "test.112025@gmail.com",
        clientId: "619871118533-k7aiak6ljv383a3tsbel783bkacvi43k.apps.googleusercontent.com",
        clientSecret: "EPtFDN0mccRwsUofp0YtxFmE",
        refreshToken: "1//044uOgw_PkGSOCgYIARAAGAQSNwF-L9IruW35SdCl_RUULvTAigoxovhCptKe7XCm_cWzVwm71EyTyEkTpvN0DuWmfA0u_UIO4Fo",
        accessToken: accessToken
    }
});

let send = async (to, token) => {
    return new Promise((res, rej) => {
        send_mail.sendMail({
            from: 'test.112025@gmail.com',
            to: to,
            html:
                '<p style="font-size: 16px; text-align: center;">Hi, dear user</p>' +
                '<p style="font-size: 16px; text-align: center;">This is your account confirmation email&nbsp;</p>' +
                '<p style="font-size: 18px; text-align: center;"><button href=' + 'https://hypertherm.herokuapp.com/confirm/' + to + '/' + token + '</button></p>' +
                '<p style="text-align: center;">Click on that url, for "Confirm Account"</p>',
            subject: 'Email Verification',
            generateTextFromHTML: true
        }, function (err, info) {
            if (err) res(false);
            if (info) {
                send_mail.close();
                res(true);
            }
        })
    })
}





module.exports = send;
