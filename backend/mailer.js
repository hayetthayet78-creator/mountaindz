const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    }
});

async function sendConfirmationEmail(toEmail, details) {
    await transporter.sendMail({
        from: '"MountainDZ" <' + process.env.GMAIL_USER + '>',
        to: toEmail,
        subject: 'Confirmation de votre reservation - MountainDZ',
        html: '<h2>Reservation confirmee !</h2>' +
            '<p>Bonjour <strong>' + details.nom + '</strong>,</p>' +
            '<p>Activite : <strong>' + details.activite + '</strong></p>' +
            '<p>Date : <strong>' + details.date + '</strong></p>'
    });
}

async function sendStatusUpdateEmail(toEmail, details, newStatus, type) {
    let subject = '';
    let html = '';
    
    if (type === 'reservation') {
        subject = `Mise à jour de votre réservation - MountainDZ`;
        html = `<h2>Mise à jour de réservation</h2>
                <p>Bonjour ${details.client_nom},</p>
                <p>Le statut de votre réservation pour <strong>${details.titre}</strong> a été mis à jour.</p>
                <p>Nouveau statut : <strong>${newStatus}</strong></p>`;
    } else if (type === 'commande') {
        subject = `Mise à jour de votre commande - MountainDZ`;
        html = `<h2>Mise à jour de commande</h2>
                <p>Bonjour ${details.client_nom},</p>
                <p>Le statut de votre commande (Total: ${details.total}) a été mis à jour.</p>
                <p>Nouveau statut : <strong>${newStatus}</strong></p>`;
    } else if (type === 'candidature') {
        subject = `Mise à jour de votre candidature - MountainDZ`;
        html = `<h2>Candidature pour le poste de ${details.poste}</h2>
                <p>Bonjour ${details.prenom} ${details.nom},</p>
                <p>Le statut de votre candidature a été mis à jour.</p>
                <p>Nouveau statut : <strong>${newStatus}</strong></p>`;
    }

    try {
        await transporter.sendMail({
            from: '"MountainDZ" <' + process.env.GMAIL_USER + '>',
            to: toEmail,
            subject: subject,
            html: html
        });
        console.log(`Email sent to ${toEmail} for ${type} status ${newStatus}`);
    } catch (e) {
        console.error("Failed to send email", e);
    }
}

async function sendReplyEmail(toEmail, details, replyMessage, type) {
    let subject = '';
    let html = '';
    
    if (type === 'message') {
        subject = `Réponse à votre message: ${details.sujet || 'Contact'} - MountainDZ`;
        html = `<h2>Bonjour ${details.prenom} ${details.nom},</h2>
                <p>Suite à votre message :</p>
                <blockquote style="border-left: 3px solid #ccc; padding-left: 10px;">${details.message}</blockquote>
                <p><strong>Notre réponse :</strong></p>
                <p>${replyMessage.replace(/\n/g, '<br>')}</p>`;
    } else if (type === 'candidature') {
        subject = `Réponse à votre candidature: ${details.poste} - MountainDZ`;
        html = `<h2>Bonjour ${details.prenom} ${details.nom},</h2>
                <p>Suite à votre candidature pour le poste de ${details.poste}.</p>
                <p><strong>Notre réponse :</strong></p>
                <p>${replyMessage.replace(/\n/g, '<br>')}</p>`;
    }

    try {
        await transporter.sendMail({
            from: '"MountainDZ" <' + process.env.GMAIL_USER + '>',
            to: toEmail,
            subject: subject,
            html: html
        });
        console.log(`Reply email sent to ${toEmail} for ${type}`);
    } catch (e) {
        console.error("Failed to send reply email", e);
    }
}

module.exports = { sendConfirmationEmail, sendStatusUpdateEmail, sendReplyEmail };