import nodemailer from 'nodemailer';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
let warnedMissingConfig = false;

const isConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_NOTIFICATION_EMAIL);

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

export default class EmailService {
  // Notificação best-effort: nunca deve derrubar o fluxo que a chamou
  // (criação de pedido/mensagem) se o e-mail falhar ou não estiver configurado.
  static async notifyAdmin(subject: string, text: string) {
    if (!isConfigured()) {
      if (!warnedMissingConfig) {
        console.warn(
          'Notificação por e-mail não configurada (defina SMTP_HOST, SMTP_USER, SMTP_PASS e ADMIN_NOTIFICATION_EMAIL no .env). Pulando envio.'
        );
        warnedMissingConfig = true;
      }
      return;
    }

    try {
      await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject,
        text,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação por e-mail:', error);
    }
  }
}
