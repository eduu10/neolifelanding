const baseStyle = `
  body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: linear-gradient(135deg, #008575, #006B5E); padding: 40px 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
  .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
  .body { padding: 40px 30px; color: #333333; line-height: 1.7; }
  .body h2 { color: #008575; font-size: 22px; margin: 0 0 16px; }
  .body p { font-size: 15px; margin: 0 0 16px; color: #555555; }
  .cta { display: inline-block; background: linear-gradient(135deg, #008575, #006B5E); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; margin: 8px 0 24px; }
  .footer { background: #f9f9f9; padding: 24px 30px; text-align: center; border-top: 1px solid #eeeeee; }
  .footer p { font-size: 12px; color: #999999; margin: 0 0 4px; }
  .divider { height: 1px; background: #eeeeee; margin: 24px 0; }
  .highlight { background: #f0faf8; border-left: 4px solid #008575; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 16px 0; }
  .highlight p { margin: 0; color: #333333; }
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; }
    .header, .body, .footer { padding-left: 20px !important; padding-right: 20px !important; }
  }
`;

function wrapTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neolife Odontologia</title>
  <style>${baseStyle}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Neolife Odontologia</h1>
      <p>Excelencia em Reabilitacao Oral</p>
    </div>
    ${content}
    <div class="footer">
      <p>Neolife Odontologia - Todos os direitos reservados</p>
      <p>Voce recebeu este email porque se cadastrou em nosso site.</p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeTemplate(name: string): string {
  const content = `
    <div class="body">
      <h2>Bem-vindo(a), ${name}! 🎉</h2>
      <p>Estamos muito felizes em ter voce conosco! Voce deu o primeiro passo para transformar seu sorriso com a Neolife Odontologia.</p>

      <div class="highlight">
        <p><strong>O que acontece agora?</strong></p>
        <p>Nossa equipe ira entrar em contato com voce em breve para agendar sua avaliacao personalizada.</p>
      </div>

      <p>Na Neolife, combinamos tecnologia de ponta com expertise clinica para oferecer os melhores resultados em reabilitacao oral.</p>

      <p>Enquanto isso, que tal conhecer mais sobre nossos tratamentos?</p>

      <div style="text-align: center;">
        <a href="https://neolifeodontologia.com.br" class="cta">Conhecer Tratamentos</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 13px; color: #888;">Dados do cadastro:<br>
      Nome: {{nome}}<br>
      Cidade: {{cidade}}<br>
      Queixa principal: {{queixa}}</p>
    </div>`;

  return wrapTemplate(content);
}

export function recoveryTemplate(name: string): string {
  const content = `
    <div class="body">
      <h2>Ola, ${name}! Sentimos sua falta</h2>
      <p>Notamos que voce iniciou um cadastro em nosso site, mas nao chegou a concluir. Sabemos que decidir sobre tratamentos odontologicos e um passo importante.</p>

      <div class="highlight">
        <p><strong>Estamos aqui para ajudar!</strong></p>
        <p>Se voce tiver alguma duvida sobre nossos tratamentos ou precisar de mais informacoes, nossa equipe esta pronta para te atender.</p>
      </div>

      <p>A Neolife Odontologia oferece:</p>
      <ul style="color: #555555; font-size: 15px; line-height: 2;">
        <li>Implantes dentarios com tecnologia guiada</li>
        <li>Protocolos All-on-4 e All-on-6</li>
        <li>Lentes de contato dental</li>
        <li>Reabilitacao oral completa</li>
      </ul>

      <p>Complete seu cadastro e agende uma avaliacao sem compromisso:</p>

      <div style="text-align: center;">
        <a href="https://neolifeodontologia.com.br" class="cta">Completar Cadastro</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 13px; color: #888;">Este email foi enviado para {{nome}} de {{cidade}}.</p>
    </div>`;

  return wrapTemplate(content);
}

export function offerTemplate(name: string): string {
  const content = `
    <div class="body">
      <h2>Oferta Especial para voce, ${name}!</h2>
      <p>Preparamos uma condicao exclusiva para voce que demonstrou interesse em nossos tratamentos.</p>

      <div class="highlight">
        <p><strong>Avaliacao Gratuita + Condicoes Especiais</strong></p>
        <p>Agende sua avaliacao esta semana e ganhe condicoes exclusivas de pagamento para seu tratamento.</p>
      </div>

      <p>Por que escolher a Neolife?</p>
      <ul style="color: #555555; font-size: 15px; line-height: 2;">
        <li>Equipe com mais de 15 anos de experiencia</li>
        <li>Tecnologia de ultima geracao</li>
        <li>Resultados comprovados com casos reais</li>
        <li>Facilidades de pagamento</li>
      </ul>

      <p><strong>Vagas limitadas!</strong> Garanta ja a sua avaliacao:</p>

      <div style="text-align: center;">
        <a href="https://neolifeodontologia.com.br" class="cta">Agendar Avaliacao</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 13px; color: #888;">Oferta exclusiva para {{nome}} de {{cidade}}.<br>Queixa informada: {{queixa}}</p>
    </div>`;

  return wrapTemplate(content);
}

export function followupTemplate(name: string): string {
  const content = `
    <div class="body">
      <h2>Como vai, ${name}?</h2>
      <p>Estamos entrando em contato para saber como voce esta e se podemos ajuda-lo(a) com alguma duvida sobre nossos tratamentos.</p>

      <div class="highlight">
        <p><strong>Sua saude bucal e nossa prioridade</strong></p>
        <p>Sabemos que cada paciente e unico. Por isso, oferecemos um plano de tratamento 100% personalizado para suas necessidades.</p>
      </div>

      <p>Muitos pacientes nos procuram com duvidas semelhantes. Veja o que nossos pacientes dizem:</p>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 16px 0;">
        <p style="font-style: italic; color: #555; margin: 0;">"A equipe da Neolife transformou meu sorriso e minha autoestima. Recomendo de olhos fechados!"</p>
        <p style="color: #008575; font-weight: 600; font-size: 13px; margin: 8px 0 0;">- Paciente Neolife</p>
      </div>

      <p>Gostaria de conversar com um de nossos especialistas? Estamos a disposicao:</p>

      <div style="text-align: center;">
        <a href="https://neolifeodontologia.com.br" class="cta">Falar com Especialista</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 13px; color: #888;">Email enviado para {{nome}} de {{cidade}}.<br>Queixa: {{queixa}}</p>
    </div>`;

  return wrapTemplate(content);
}
