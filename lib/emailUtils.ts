import emailjs from 'emailjs-com';

const USER_ID = 'qT-d1yqztpg34D_m3';
const SERVICE_ID = 'service_0785y6d';
const TEMPLATE_ID = 'template_z8okgvg';

if (!USER_ID) {
  throw new Error('EMAILJS_USER_ID is not set in environment variables');
}

emailjs.init(USER_ID);

export async function sendConfirmationEmail(to: string, code: string): Promise<void> {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Confirmação</title>
    <style>
      body { 
        font-family: 'Segoe UI', Arial, sans-serif; 
        line-height: 1.6; 
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        padding: 20px;
        background-color: #ffffff;
      }
      .header { 
        background-color: #f95f00; 
        padding: 20px; 
        text-align: center;
        color: white;
      }
      .content { 
        padding: 30px 20px;
        background-color: #ffffff;
        text-align: center;
      }
      .code-container { 
        margin: 30px 0;
      }
      .code-box { 
        display: inline-block; 
        padding: 15px 30px;
        background-color: #f95f00; 
        color: white; 
        font-size: 28px; 
        font-weight: bold; 
        text-align: center; 
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        letter-spacing: 2px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Código de Confirmação</h1>
      </div>
      <div class="content">
        <p>Seu código de confirmação é:</p>
        <div class="code-container">
          <div class="code-box">${code}</div>
        </div>
        <p>Por favor, insira este código para confirmar sua conta.</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Novos Proejetos</p>
      </div>
    </div>
  </body>
  </html>
`;

  const templateParams = {
    to: to,
    message: htmlContent,
    subject: `Código de Confirmação ${code} - Redefinição de Senha`,
  };

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('Email sent successfully!', response.status, response.text);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Falha ao enviar o email de confirmação. Verifique os dados e tente novamente.');
  }
}

