const nodeMailer = require("nodemailer");
const serverData = require("./serverData");

const transportOpts = {
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: serverData.mailData.user,
    pass: serverData.mailData.pass
  }
};

module.exports = {
  mailer: async function(address, place) {
    let transporter = nodeMailer.createTransport(transportOpts);
    let info = await transporter.sendMail({
      from: "gsksh3@mail.ru", // sender address
      to: "gsksh3@mail.ru", // list of receivers
      subject: "Запрос акта", // Subject line
      text: `место номер ${place}`, // plain text body
      html: `<p>email: ${address} место номер ${place}</p>` // html body
    });
    console.log("Message sent: %s", info.messageId);
  }
};
