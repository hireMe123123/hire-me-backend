const nodemailer = require("nodemailer");

const fs = require("fs");
const path = require("path");

const mustache = require("mustache");
const gmail = require("../config/gmail");

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "hire66779@gmail.com",
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
          accessToken: gmail.accessToken,
        },
      });
      const filePath = path.join(__dirname, `../templates/${data.template}`);
      const fileTemplate = fs.readFileSync(filePath, "utf8");

      const mailOptions = {
        from: '"HireMe" <hire66779@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }),
  sendMailToResetPassword: (data) =>
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "hire66779@gmail.com",
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
          accessToken: gmail.accessToken,
        },
      });
      const filePath = path.join(__dirname, `../templates/${data.template}`);
      const fileTemplate = fs.readFileSync(filePath, "utf8");
      const mailOptions = {
        from: '"HireMe" <hire66779@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }),
  hiredGreetings: (data) =>
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "hire66779@gmail.com",
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
          accessToken: gmail.accessToken,
        },
      });
      const filePath = path.join(__dirname, `../templates/${data.template}`);
      const fileTemplate = fs.readFileSync(filePath, "utf8");
      const mailOptions = {
        from: '"HireMe" <hire66779@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }),
};
