exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { prenom, email, tel } = data;

  if (!prenom || !email) {
    return { statusCode: 400, body: 'Prenom et email requis' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // Mail à l'inscrit
  const mailInscrit = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Calculateur Chantier <onboarding@resend.dev>',
      to: 'nextlevelagency33@gmail.com',
      subject: `${prenom}, voici ton accès au calculateur chantier 🔥`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <span style="background: rgba(255,140,0,0.15); border: 1px solid rgba(255,140,0,0.3); color: #ff8c00; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 1px;">CALCULATEUR CHANTIER</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; text-align: center; margin-bottom: 12px;">
            Salut ${prenom} 👋
          </h1>
          <p style="color: #aaa; text-align: center; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            Ton accès au calculateur est prêt. Découvre ta vraie marge sur chaque chantier.
          </p>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.URL || 'https://ton-site.netlify.app'}/outil.html"
               style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #ff8c00, #e67600); color: #000; border-radius: 12px; font-size: 16px; font-weight: 800; text-decoration: none; letter-spacing: 0.5px;">
              🔥 Accéder au calculateur
            </a>
          </div>

          <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #ff8c00;">Envie d'aller plus loin ?</h3>
            <p style="color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
              Rejoins la formation et apprends à fixer tes prix, maîtriser tes charges et maximiser ta rentabilité sur chaque chantier.
            </p>
            <a href="https://www.skool.com/latelier-4560"
               style="display: inline-block; padding: 12px 24px; background: #1a1a1a; color: #ff8c00; border: 1px solid rgba(255,140,0,0.3); border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none;">
              Découvrir la formation →
            </a>
          </div>

          <p style="color: #444; font-size: 12px; text-align: center;">Tu reçois ce mail car tu t'es inscrit sur le calculateur chantier.</p>
        </div>
      `
    })
  });

  // Notif à toi avec les données de l'inscrit en bas
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Calculateur Chantier <onboarding@resend.dev>',
      to: 'nextlevelagency33@gmail.com',
      subject: `Nouvelle inscription : ${prenom}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
          <h2 style="color: #ff8c00; margin-bottom: 20px;">🔔 Nouvelle inscription</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #222; color: #aaa;">Prénom</td><td style="padding: 10px; border-bottom: 1px solid #222; font-weight: 700;">${prenom}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #222; color: #aaa;">Email</td><td style="padding: 10px; border-bottom: 1px solid #222; font-weight: 700;">${email}</td></tr>
            <tr><td style="padding: 10px; color: #aaa;">Téléphone</td><td style="padding: 10px; font-weight: 700;">${tel || 'non renseigné'}</td></tr>
          </table>
        </div>
      `
    })
  });

  if (!mailInscrit.ok) {
    const err = await mailInscrit.text();
    console.error('Resend error:', err);
    return { statusCode: 500, body: err };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
