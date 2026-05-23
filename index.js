const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

/* MAILERSEND CONFIGURATION */
const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY, // process.env.API_KEY si vous hébergez sur GitHub
});
const sentFrom = new Sender(
  `asma@${process.env.DOMAIN}`, // `you@${process.env.DOMAIN}` si vous hébergez sur GitHub (n'oubliez pas le nom avant @trial)
  "Asma Meziou", // votre nom
);

app.get("/", (req, res) => {
  res.status(200).json("Server is up !");
});
app.get("/form", (req, res) => {
  res.send("Route form OK");
});

app.post("/form", async (req, res) => {
  try {
    //   Le console.log de req.body nous affiche les données qui ont été rentrées dans les inputs (dans le formulaire frontend) :
    console.log(req.body);

    // On destructure req.body
    const { firstname, lastname, email, message } = req.body;

    //   On crée un tableau contenant les informations reçues du(des) client(s) :
    const recipients = [new Recipient(email, `${firstname} ${lastname}`)];
    // On configure le mail que l'on s'apprête à envoyer :
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("This is a Subject")
      .setHtml("<strong>" + message + "</strong>")
      .setText(message);

    // On envoie les infos à MailerSend pour créer le mail et l'envoyer.
    const result = await mailerSend.email.send(emailParams);

    console.log(result); // réponse de MailerSend

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is started ! 📧");
});
