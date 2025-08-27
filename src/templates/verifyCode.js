export const verifyCode = (code) => `
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px 20px;">
    <div style="text-align: center; margin-bottom: 50px;">
        <img src="https://res.cloudinary.com/allfunds/image/upload/v1756297103/logo_zoahez.png"
            style="width: 75px; height: 75px;" alt="Vitly Logo">
    </div>

    <div style="margin-bottom: 60px; font-size: 14px; font-weight: 400; line-height: 22px; color: #333333;">
        <h1
            style="font-size: 24px; font-weight: 500; margin-bottom: 32px; margin-top: 0; line-height: 32px; color: #000000; text-transform: capitalize;">
            ¡Hola!</h1>

        <p style="margin-bottom: 32px; margin-top: 0;">Gracias por registrarte en VitlyApp. Para completar tu registro y
            comenzar tu transformación, necesitamos verificar tu dirección de email.</p>

        <p style="margin-bottom: 32px; margin-top: 0;">Es muy sencillo, solo tienes que introducir el siguiente código
            de verificación en la aplicación:</p>

        <div style="text-align: center; margin: 40px 0;">
            <div
                style="display: inline-block; background-color: #f8f9fa; border: 2px solid #e9ecef; padding: 20px 30px; border-radius: 10px; font-size: 24px; font-weight: 700; letter-spacing: 3px; color: #FE724C;">
                ${code}
            </div>
        </div>

        <p style="margin-bottom: 10px; margin-top: 0; font-weight: 700; font-size: 16px; line-height: 24px;">
            <strong>IMPORTANTE:</strong>
        </p>

        <p style="margin-bottom: 32px; margin-top: 0;">Este código es válido por 15 minutos. Si no completas la
            verificación en este tiempo, deberás solicitar un nuevo código.</p>

        <p style="margin-bottom: 32px; margin-top: 0;">Si no solicitaste esta verificación, puedes ignorar este correo
            de forma segura.</p>
    </div>

    <hr style="border: none; height: 1px; background-color: #E5E7EB; margin: 16px 0;">

    <div style="text-align: center; font-size: 10px; color: #000000; line-height: 100%; font-weight: 400;">
        <p style="margin-bottom: 16px;">© 2025 VitlyApp. Todos los derechos reservados.</p>

        <p style="margin: 0;">
            Este correo fue enviado automáticamente como parte del proceso de verificación de tu cuenta en VitlyApp.
            Si no te registraste en VitlyApp, puedes ignorar este mensaje de forma segura.
        </p>
    </div>
</body>

</html>
`