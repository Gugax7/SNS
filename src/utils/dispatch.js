const axios = require('axios');

function dispatchMessage(endpoint, protocol, payload){
  switch(protocol) {
    case 'http':
    case 'https':
      const response = axios.post(endpoint, payload);
      
      return response;

    case 'email':
      console.log(`📧 Simulando envio de E-MAIL para: ${endpoint}`);
      console.log(`   Assunto: Novo Evento | Corpo: ${JSON.stringify(payload)}`);
      
      return true;
    
    case 'sms':
      console.log(`📱 Simulando envio de SMS para: ${endpoint}`);
      console.log(`   Mensagem: Você tem uma nova notificação!`);
      // return await twilioClient.messages.create(...)
      return true;

    default:
      throw new Error(`Protocolo '${protocol}' não é suportado pelo sistema.`);

  }
}

module.exports = {
  dispatchMessage
}