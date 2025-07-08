import axios from "axios";
import Sticker from "../../Libs/Sticker.js";

export default {
  command: ["brat"],
  description: "Sticker teks brat (efek animasi atau gambar)",
  category: "Sticker",
  owner: false,
  group: false,
  admin: false,
  hidden: false,
  limit: false,
  private: false,

  haruna: async function (m, { sock, config, text }) {
    let input = m.quoted?.text || text;
    if (!input) return m.reply("> Balas atau masukkan teks yang ingin diubah.");

    const isAnimated = /--animated/i.test(input);
    if (isAnimated) input = input.replace(/--animated/gi, "").trim();

    await m.reply("Tunggu sebentar...");

    try {
      const makeSticker = async (buffer) => {
        return await Sticker.create(buffer, {
          packname: config?.sticker?.packname || "Created by",
          author: config?.sticker?.author || "mici",
          emojis: ["😈"]
        });
      };

      if (isAnimated) {
        const txtArr = input.split(" ").filter(Boolean);
        let lastBuffer;
        for (let i = 0; i < txtArr.length; i++) {
          const word = txtArr.slice(0, i + 1).join(" ");
          const res = await axios.get(
            `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(word)}`,
            { responseType: "arraybuffer" }
          );
          if (res.status !== 200) {
            throw new Error(`Server returned status code ${res.status}`);
          }
          lastBuffer = res.data;
        }
        const sticker = await makeSticker(lastBuffer);
        await sock.sendMessage(m.chat, { sticker }, { quoted: m });
      } else {
        const res = await axios.get(
          `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(input)}`,
          { responseType: "arraybuffer" }
        );
        if (res.status !== 200) {
          throw new Error(`Server returned status code ${res.status}`);
        }
        const sticker = await makeSticker(res.data);
        await sock.sendMessage(m.chat, { sticker }, { quoted: m });
      }
    } catch (e) {
      console.error(e);
      m.reply(`Gagal membuat sticker brat: ${e.message}`);
    }
  }
};
