import { Client } from '@prisma/client';

/**
 * Simula el envío de notificación por WhatsApp.
 * En producción, integrar con la API de WhatsApp Business
 * (Twilio, Meta Business API, etc.)
 */
export async function sendReadyNotification(client: Client, ticketNumber: number) {
  const message = `¡Hola ${client.name}! Tu pedido #${ticketNumber} está LISTO para retirar. ¡Te esperamos!`;

  // TODO: Integrar con API de WhatsApp Business
  console.log(`[WHATSAPP SIMULADO] Para: ${client.phone}`);
  console.log(`[WHATSAPP SIMULADO] Mensaje: ${message}`);

  return { sent: true, phone: client.phone, message };
}
