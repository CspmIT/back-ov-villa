function Register(data) {
    try {
        const hmtl = `<!doctype html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Recupero de contraseña</title>
          <style>
            @media only screen and (max-width:600px){
              .container { width: 100% !important; padding: 20px !important; }
              .content { font-size: 16px !important; }
            }
          </style>
        </head>
        <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding:24px 12px;">
                <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="width:600px;background: #6f1240;border-radius:12px;overflow:hidden;">
                  
                  <!-- Logo -->
                  <tr>
                    <td style="text-align:center;padding:30px 20px 10px;">
                      <img src="https://cspvilla.cooptech.com.ar/assets/OficinaVirtual_cuadrado-apCkLuHW.png" alt="Oficina Virtual" style="max-width:120px;border:0;">
                    </td>
                  </tr>
        
                  <!-- Título -->
                  <tr>
                    <td style="padding:0 30px 10px;text-align:center;">
                      <h1 style="font-size:22px;margin:0;color:#ffffff;">Activación de Cuenta</h1>
                    </td>
                  </tr>
        
                  <!-- Mensaje -->
                  <tr>
                    <td style="padding:0 30px 20px;text-align:center;">
                      <p style="margin:0;font-size:16px;line-height:1.5;color:#f0f0f0;">
                        Hola <strong>${data.name || 'Usuario'}</strong>,<br>
                        Haz click en el siguiente link para habilitar la cuenta:
                      </p>
                    </td>
                  </tr>
        
                  <!-- Botón -->
                  <tr>
                    <td style="padding:10px 30px 30px;text-align:center;">
                      <a href="${data.link}" target="_blank" style="display:inline-block;padding:12px 24px;background:#ff4da6;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:8px;font-size:16px;">
                      Haz Click aqui                     
                    </a>
                    </td>
                  </tr>
        
                  <!-- Footer --> 
                  <tr>
                    <td style="background:rgba(255,255,255,0.05);padding:20px;text-align:center;font-size:12px;color:#bbbbbb;">
                      © ${new Date().getFullYear()} CoopTech · Oficina Virtual · CoopMorteros 
                      <br>
                      <a href="mailto:info@coopmorteros.coop" style="color:#ff99cc;text-decoration:none;">info@coopmorteros.coop</a> · Tel: (03562)-402000
                    </td>
                  </tr>
        
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>`
        return hmtl
    } catch (error) {
        throw new Error(error)
    }
}
function PasswordRecovery(data) {
    try {
      const html = `<!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Recupero de contraseña</title>
    <style>
      @media only screen and (max-width:600px){
        .container { width: 100% !important; padding: 20px !important; }
        .content { font-size: 16px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="width:600px;background: #6f1240;border-radius:12px;overflow:hidden;">
            
            <!-- Logo -->
            <tr>
              <td style="text-align:center;padding:30px 20px 10px;">
                <img src="https://cspvilla.cooptech.com.ar/assets/OficinaVirtual_cuadrado-apCkLuHW.png" alt="Oficina Virtual" style="max-width:120px;border:0;">
              </td>
            </tr>
  
            <!-- Título -->
            <tr>
              <td style="padding:0 30px 10px;text-align:center;">
                <h1 style="font-size:22px;margin:0;color:#ffffff;">Recuperá tu contraseña</h1>
              </td>
            </tr>
  
            <!-- Mensaje -->
            <tr>
              <td style="padding:0 30px 20px;text-align:center;">
                <p style="margin:0;font-size:16px;line-height:1.5;color:#f0f0f0;">
                  Hola <strong>${data.name || 'Usuario'}</strong>,<br>
                  recibimos una solicitud para restablecer tu contraseña.  
                  Hacé clic en el botón de abajo para continuar:
                </p>
              </td>
            </tr>
  
            <!-- Botón -->
            <tr>
              <td style="padding:10px 30px 30px;text-align:center;">
                <a href="${data.link}" target="_blank" style="display:inline-block;padding:12px 24px;background:#ff4da6;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:8px;font-size:16px;">
                  Restablecer contraseña
                </a>
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td style="background:rgba(255,255,255,0.05);padding:20px;text-align:center;font-size:12px;color:#bbbbbb;">
                © ${new Date().getFullYear()} CoopTech · Oficina Virtual · CoopMorteros 
                <br>
                <a href="mailto:info@coopmorteros.coop" style="color:#ff99cc;text-decoration:none;">info@coopmorteros.coop</a> · Tel: (03562)-402000
              </td>
            </tr>
  
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
      return html;
    } catch (error) {
      throw new Error(error);
    }
  }
  
module.exports = {
    Register,
    PasswordRecovery
}
