export default {
    command: ["web2zip"],
    description: "Clone Website Static",
    category: "Others",
    owner: false,
    admin: false,
    hidden: false,
    limit: false,
    group: false,
    private: false,

    haruna: async function (m, { sock, api, text }) {
        if (!text) return m.reply("Silakan berikan URL untuk mengunduh file ZIP.");

        m.react('🕐');

        try {
            const res = await api.get("/web2zip", { url: text });

            if (res.status === "Success" && res.result) {
                const { url, size, expired } = res.result;

                await m.react('☑️');
                await sock.sendMessage(
                    m.chat,
                    { document: { url: url }, mimetype: 'application/zip', fileName: name.split('/').pop(), caption: `*Size:* ${size}\n*Expired:* ${expired}\n\n_nih kak hasil nya janlup follow mici :3_` },
                    { quoted: m }
                );
            } else {
                await m.react('❌');
                m.reply("Tidak dapat mengunduh file ZIP dari URL yang diberikan.");
            }
        } catch (error) {
            console.error("Error:", error);
            await m.react('❌');
            m.reply("Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.");
        }
    },

    failed: "Gagal menjalankan perintah %cmd\n\n%error",
    wait: null,
    done: null,
};
