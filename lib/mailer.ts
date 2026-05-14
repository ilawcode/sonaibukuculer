import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (2FA gerekli)
  },
});

export interface SendActionMailOptions {
  to: string;
  assigneeName: string;
  actionDescription: string;
  sessionTitle: string;
  retroKey: string;
  dueDate?: Date;
}

export async function sendActionMail(options: SendActionMailOptions): Promise<void> {
  const { to, assigneeName, actionDescription, sessionTitle, retroKey, dueDate } = options;

  const dueDateStr = dueDate
    ? new Date(dueDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>LEAN Retro - Aksiyon Bildirimi</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(120,140,200,0.12);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#b8d4f0,#c9b8e8);padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:1.5rem;font-weight:800;letter-spacing:4px;color:#3a3a5c;">LEAN</span>
                    <span style="font-size:0.85rem;font-weight:500;color:#7a7a9a;margin-left:6px;">Retro</span>
                  </td>
                  <td align="right">
                    <span style="background:rgba(255,255,255,0.5);border-radius:20px;padding:4px 14px;font-size:0.78rem;font-weight:600;color:#3a3a5c;font-family:monospace;letter-spacing:2px;">${retroKey}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:0.9rem;color:#7a7a9a;">Merhaba <strong style="color:#3a3a5c;">${assigneeName}</strong>,</p>
              <h2 style="margin:0 0 20px;font-size:1.2rem;color:#3a3a5c;font-weight:700;">
                Sana bir aksiyon atandı 🎯
              </h2>

              <!-- Action Box -->
              <div style="background:linear-gradient(135deg,#daeaf8,#b8d4f0);border-left:4px solid #7aafd4;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:0.75rem;font-weight:600;color:#7a7a9a;text-transform:uppercase;letter-spacing:1px;">Aksiyon</p>
                <p style="margin:0;font-size:1rem;color:#3a3a5c;font-weight:500;line-height:1.6;">${actionDescription}</p>
              </div>

              <!-- Meta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #e0e4f0;">
                    <span style="font-size:0.82rem;color:#7a7a9a;">📋 Retro Oturumu</span>
                  </td>
                  <td align="right" style="padding:8px 0;border-bottom:1px solid #e0e4f0;">
                    <span style="font-size:0.82rem;color:#3a3a5c;font-weight:500;">${sessionTitle}</span>
                  </td>
                </tr>
                ${
                  dueDateStr
                    ? `<tr>
                  <td style="padding:8px 0;border-bottom:1px solid #e0e4f0;">
                    <span style="font-size:0.82rem;color:#7a7a9a;">📅 Son Tarih</span>
                  </td>
                  <td align="right" style="padding:8px 0;border-bottom:1px solid #e0e4f0;">
                    <span style="font-size:0.82rem;color:#3a3a5c;font-weight:500;">${dueDateStr}</span>
                  </td>
                </tr>`
                    : ""
                }
              </table>

              <p style="margin:0;font-size:0.82rem;color:#7a7a9a;line-height:1.6;">
                Bu e-posta LEAN Retro uygulaması tarafından otomatik olarak gönderilmiştir.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f6fb;padding:16px 32px;text-align:center;border-top:1px solid #e0e4f0;">
              <p style="margin:0;font-size:0.75rem;color:#7a7a9a;">LEAN Retro · Takımınızla daha iyi retrospektifler</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"LEAN Retro" <${process.env.GMAIL_USER}>`,
    to,
    subject: `[LEAN Retro] Yeni Aksiyon: ${actionDescription.slice(0, 60)}${actionDescription.length > 60 ? "..." : ""}`,
    html,
  });
}
