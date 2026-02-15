require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const amqp = require('amqplib');
const PlaylistsService = require('./src/PlaylistsService');
const MailSender = require('./src/MailSender');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  // Connect ke RabbitMQ
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  const queueName = 'export:playlists';
  await channel.assertQueue(queueName, { durable: true });

  console.log(`[*] Menunggu pesan di queue: ${queueName}`);

  // Listen ke queue
  channel.consume(
    queueName,
    async (message) => {
      try {
        // Parsing JSON untuk mendapat playlistId dan targetEmail
        const { playlistId, targetEmail } = JSON.parse(message.content.toString());

        console.log(`[x] Menerima pesan untuk playlist: ${playlistId}, email: ${targetEmail}`);

        // Eksekusi PlaylistsService
        const playlistData = await playlistsService.getSongsInPlaylist(playlistId);

        // Convert ke JSON string
        const playlistJson = JSON.stringify(playlistData, null, 2);

        // Kirim email menggunakan MailSender
        await mailSender.sendEmail(targetEmail, playlistJson);

        console.log(`[✓] Email berhasil dikirim ke: ${targetEmail}`);

        // Acknowledge pesan jika sukses
        channel.ack(message);
      } catch (error) {
        console.error('[✗] Error memproses pesan:', error.message);
        // Bisa ditambahkan logic untuk reject atau requeue message
        channel.ack(message); // Ack agar tidak terus di-requeue
      }
    },
    { noAck: false }
  );
};

init().catch((error) => {
  console.error('Gagal menjalankan consumer:', error);
  process.exit(1);
});
