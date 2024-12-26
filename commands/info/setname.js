const { EmbedBuilder } = require("discord.js");
const db = require("quick.db"); // للتأكد من حفظ الوقت السابق

module.exports = {
    name: "sn", // اسم الأمر
    description:
        "Change bot's username to the name of the mentioned voice channel.",
    cooldown: 5000,
    aliases: [],
    async execute(client, message, args) {
        try {
            const allowedUserIds = ["1150890847768936458"];
            if (!allowedUserIds.includes(message.author.id)) {
                return;
            }

            const cooldown = 3600000; // ساعة واحدة (بالميلي ثانية)
            const lastChange =
                db.get(`lastUsernameChange_${client.user.id}`) || 0;
            const remainingTime = cooldown - (Date.now() - lastChange);

            // إذا كان تغيير الاسم ما زال تحت الكولداون
            if (remainingTime > 0) {
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
                );
                const seconds = Math.floor(
                    (remainingTime % (1000 * 60)) / 1000,
                );

                // رسالة إيمبد تعرض الوقت المتبقي
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setThumbnail(client.user.displayAvatarURL() )
                    .setTitle("> Cooldown Alert")
                    .setDescription(
                        `- :x: **تستطيع إستعمال الأمر مرة آخرى بعد:**\n\`${hours}:${minutes}.${seconds}\``,
                    )
                    .setTimestamp();

                // إرسال الرسالة وحذفها بعد 10 ثوانٍ
                const cooldownMessage = await message.reply({
                    embeds: [embed],
                });
                setTimeout(
                    () => cooldownMessage.delete().catch(() => {}),
                    10000,
                );
                return;
            }

            // التحقق من وجود منشن القناة الصوتية
            const channelMention = message.mentions.channels.first();
            if (!channelMention) {
                return message.react("❌");
            }

            // التحقق من أن القناة هي قناة صوتية
            if (channelMention.type !== 2) {
                // 2 تعني Voice Channel
                return message.react("❌");
            }

            // التحقق من وجود إذن لتغيير اسم المستخدم
            if (!client.user) {
                return message.react("🤖");
            }

            // تغيير اسم البوت
            await client.user.setUsername(channelMention.name);

            db.set(`lastUsernameChange_${client.user.id}`, Date.now()); // حفظ الوقت الحالي للتغيير

            await message.react("✅");
        } catch (err) {
            console.error(err);
            message.react("🚫");
        }
    },
};
