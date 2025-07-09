import { spawn } from "child_process";

export default {
  command: ["toimg"],
  description: "Convert sticker to media",
  category: "Sticker",
  owner: false,
  group: false,
  admin: false,
  hidden: false,
  limit: false,
  private: false,

  /**
   * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
   * @param {import("../Handler").miscOptions}
   */
  haruna: async function (m, { sock }) {
    const q = m.quoted ? m.quoted : m;

    const mime = q.message?.mimetype || "";

    if (!/webp/i.test(mime)) {
      return m.reply("Please reply/send a sticker with the command");
    }

    // Unduh media
    const media = await q.download();
    const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");

    // Fungsi konversi buffer webp ke png
    const convert = () => new Promise((resolve, reject) => {
      try {
        const chunks = [];
        const command = spawn("convert", ["webp:-", "png:-"]);
        command.on("error", reject);
        command.stdout.on("data", chunk => chunks.push(chunk));
        command.stdin.write(buffer);
        command.stdin.end();
        command.on("exit", () => resolve(Buffer.concat(chunks)));
      } catch (err) {
        reject(err);
      }
    });

    try {
      const convertedImage = await convert();

      await sock.sendMessage(
        m.chat,
        { image: convertedImage },
        { quoted: m }
      );
    } catch (err) {
      console.error(err);
      m.reply("❌ Gagal mengonversi sticker ke gambar.");
    }
  },

  failed: "Failed to haruna the %cmd command\n%error",
  wait: null,
  done: null,
};
