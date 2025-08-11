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
        const hmtl = `<html>
    <style>
        .btn {
            margin-top: 5px;
            margin-right: 2px;
            color: #fff !important;
            text-decoration: none;
            background: #60a3bc;
            padding: 5px;
            border-radius: 10px;
            display: inline-block;
            border: none;
        }
    
        .border_div {
            border-radius: 5px;
            border-color: grey !important;
            border: 2px solid;
            width: 200px;
            margin-right: 10px;
            text-align: center;
            display: inline-block;
        }
    
        .p {
            font-size: 20px;
        }
    
        .tamano_iconos {
            width: 10% !important;
        }
    
        .ancho_img {
            max-width: 20%;
            margin: auto;
        }
    
        .imagen_fondo {
            background-color: #fcf6423d;
            background-image: linear-gradient(to bottom, white, #fcf642);
        }
    
        @media(max-width: 550px) {
            .ancho_img {
                max-width: 50%;
                margin: auto;
            }
    
            .p {
                font-size: 15px;
            }
        }
    </style>
    
    <body class="imagen_fondo">
        <div style="text-align: center;margin-top: 20px;margin-bottom: 10px; background-color: black;">
            <a href="https://app.coopmorteros.coop">
                <img src="https://app.coopmorteros.coop/public/images/gifs/Ofi_Virtual_Blanco_2.gif" title="Oficina Virtual"
                    style="width:180px;" width="400" alt="Oficina Virtual">
            </a>
        </div>
        <h1 style="text-align: center;">Activación de Cuenta</h1>
    <p style="text-align:center;"><b>${data.name}</b>, Haz click en el siguiente link para recuperar tu contraseña:</p>
    <hr>
    <a href="${data.link}" style="text-align:center;font-weight:800">Haz Click aqui</a>
    <hr>
        <div style="text-align: center;margin-bottom: 10px;margin-top: 20px;">
            Te invitamos a mantenerte conectado, siguiendo nuestras redes sociales...</p>
            <br>
            <br>
            <div style="text-align:center;"> <a title="Twitter" href="https://twitter.com/coopmorteros?lang=es"><img
                        class="tamano_iconos" src="https://app.coopmorteros.coop/public/images/redes_sociales/Twitter.png"
                        alt="Twitter"></a>
                <a title="Instagram" style="padding-top:15;" href="https://www.instagram.com/coopmorteros/?hl=es-la"><img
                        class="tamano_iconos" src="https://app.coopmorteros.coop/public/images/redes_sociales/instagram.png"
                        alt="Instagram"></a>
                <a title="Facebook" href="https://es-la.facebook.com/coopmorteros/"><img class="tamano_iconos"
                        src="https://app.coopmorteros.coop/public/images/redes_sociales/facebook.png" alt="Facebook"></a>
            </div>
            <br>
        </div>
        <div style="text-align: center;margin-top: 30px;margin-bottom: 10px;"><a href="https://app.coopmorteros.coop"
                target="_blank" style="margin-left: 10px;margin-right: 10px;">#VivíLaNuevaEraDigital</a> <a
                href="https://app.coopmorteros.coop" target="_blank"
                style="margin-left: 10px;margin-right: 10px;">#Coopmorteros</a> <a href="https://app.coopmorteros.coop"
                target="_blank" style="margin-left: 10px;margin-right: 10px;">#EstamosConVos</a></div>
        <br>
        <div style="text-align: center;">
            <p>
                Por consultas y/o reclamos comunicate a:<br>
                Email: info@coopmorteros.coop<br>
                Tel: (03562)-402000<br>
            </p>
        </div>
        <div style="text-align: center;"><a href="https://www.coopmorteros.com" target="_blank"><img
                    src="https://app.coopmorteros.coop/public/images/logos/ISOLOGO.png" target="_blank" alt="" height="80"
                    width=""></a> <a href="https://app.coopmorteros.coop/" target="_blank"> <img target="_blank"
                    src="https://app.coopmorteros.coop/public/images/logos/Ofi_Virtual_Negro.png" alt="" height="80"
                    width=""></a><br></div><br>
        <div style=" color: #AAAAAA;font-family: Verdana; font-size: 7pt;font-weight: normal;font-style: normal;"> Este
            correo electrónico y cualquier anexo o respuesta relacionada puede contener datos e información confidenciales y
            estar legalmente protegido.
            En caso de que lo haya recibido por error, por favor (i) notifique al remitente inmediatamente mediante un
            e-mail, (ii) no lea, copie, imprima o
            reenvíe este mensaje o cualquier anexo, o divulgue su(s) contenido(s) a terceros, y (iii) bórrelo inmediatamente
            de su sistema
            Los mensajes electrónicos no son seguros y, por lo tanto, no nos responsabilizaremos por cualquier consecuencia
            relacionada al uso
            de este mensaje (inclusive daños causados por cualquier virus). Gracias.</div>
    </body>
    
    </html>`
        return hmtl
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Register,
    PasswordRecovery
}
