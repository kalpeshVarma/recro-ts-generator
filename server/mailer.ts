import nodemailer from 'nodemailer';

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export async function sendMail(
  smtp: SmtpConfig,
  to: string[],
  cc: string[],
  bcc: string[],
  subject: string,
  body: string,
  attachment: Buffer,
  filename: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: false,
    requireTLS: true,
    auth: { user: smtp.user, pass: smtp.password },
  });

  await transporter.sendMail({
    from: smtp.from,
    to: to.join(', '),
    cc: cc.length > 0 ? cc.join(', ') : undefined,
    bcc: bcc.length > 0 ? bcc.join(', ') : undefined,
    subject,
    text: body || '',
    attachments: [{
      filename,
      content: attachment,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }],
  });
}
