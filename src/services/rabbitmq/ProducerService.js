// ProducerService — kirim pesan ke RabbitMQ queue
const amqp = require('amqplib');
const config = require('../../utils/config');

const ProducerService = {
  sendMessage: async (queue, message) => {
    // connect ke RabbitMQ server dari config
    const connection = await amqp.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();

    // pastikan queue ada dan durable (persistent)
    await channel.assertQueue(queue, {
      durable: true,
    });

    // kirim pesan dengan persistent flag biar tidak hilang kalau RabbitMQ restart
    channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true,
    });

    console.log(`[✓] Pesan terkirim ke queue '${queue}':`, message);

    // tutup connection dengan aman (kasih waktu 1 detik)
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
