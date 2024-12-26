const { EmbedBuilder } = require("discord.js");
const client = require("../index");
const config = require("../config.json");
const { DisTube } = require("distube");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const PlayerMap = new Map();

let spotifyoptions = {
	parallel: true,
	emitEventsAfterFetching: false,
};
if (config.spotify_api.enabled) {
	spotifyoptions.api = {
		clientId: config.spotify_api.clientId,
		clientSecret: config.spotify_api.clientSecret,
	};
}

const distube = new DisTube(client, {
	emitNewSongOnly: true,
	leaveOnEmpty: false,
	leaveOnFinish: false,
	leaveOnStop: false,
	savePreviousSongs: true,
	emitAddSongWhenCreatingQueue: true,
	emitAddListWhenCreatingQueue: true,
	searchSongs: 0,
	youtubeCookie: config.youtubeCookie,
	nsfw: false,
	emptyCooldown: 0,
	ytdlOptions: {
		highWaterMark: 1024 * 1024 * 64,
		quality: "highestaudio",
		format: "audioonly",
		liveBuffer: 60000,
		dlChunkSize: 1024 * 1024 * 4,
	},
	plugins: [
		new SpotifyPlugin(spotifyoptions),
		new SoundCloudPlugin(),
		new DeezerPlugin(),
	],
});

distube.on("initQueue", (queue) => {
	queue.autoplay = false;
	queue.volume = 100;
});

distube.on("addSong", (queue, song) => {
	try {
		queue.textChannel.send({
			embeds: [
				new EmbedBuilder()
					.setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
					.setDescription(
						`> ↯ **Add** \`${song.name}\` - **(**\`${song.formattedDuration}\`**)**`,
					),
			],
		});
	} catch (err) {
		console.log(err);
	}
});

distube.on("playList", (queue, playlist, song) => {
	try {
		queue.textChannel.send({
			embeds: [
				new EmbedBuilder()
					.setThumbnail(client.user.displayAvatarURL())
					.addFields(
						{
							name: "Playlist:",
							value: `\`${playlist.name}\`  -  \`${playlist.songs.length} songs\``,
							inline: true,
						},
						{
							name: "playing Song:",
							value: `\`${song.name}\`  -  \`${song.formattedDuration}\``,
							inline: true,
						},
					)
					.setFooter({
						text: `Added by  ${song.user.username}`,
						iconURL: song.user.avatarURL(),
					}),
			],
		});
	} catch (err) {
		console.log(err);
	}
});

distube.on("addList", (queue, playlist) => {
	try {
		queue.textChannel.send({
			embeds: [
				new EmbedBuilder()
					.setThumbnail(client.user.displayAvatarURL())

					.setDescription(
						`**Added [${playlist.name}](${playlist.url}) playlist (${playlist.songs.length}) songs**`,
					)
					.setFooter({
						text: `Added by ${playlist.user.username}   |  Duration: [${playlist.formattedDuration}]`,
						iconURL: playlist.user.avatarURL(),
					}),
			],
		});
	} catch (err) {
		console.log(err);
	}
});

distube.on("error", (message, e) => {
	try {
		var embed = new EmbedBuilder()
			.setAuthor({ name: `Error` })
			.setColor("#470000")
			.setDescription(e);
		message.reply({ embeds: [embed] });
	} catch (err) {
		console.log(e);
	}
});

distube.on("disconnect", (queue) => {
	try {
		queue.textChannel.messages
			.fetch(PlayerMap.get(`currentmsg`))
			.then((currentSongPlayMsg) => {
				setTimeout(() => {
					currentSongPlayMsg.edit({ components: [] });
				}, 1000);
			})
			.catch((e) => {});
	} catch (err) {
		console.log(err);
	}
});

distube.on("empty", (queue) => {
	try {
		queue.textChannel.messages
			.fetch(PlayerMap.get(`currentmsg`))
			.then((currentSongPlayMsg) => {
				setTimeout(() => {
					currentSongPlayMsg.edit({ components: [] });
				}, 1000);
			})
			.catch((e) => {});
	} catch (err) {
		console.log(err);
	}
});

distube.on("playSong", async (queue, song) => {
	try {
		// حذف الرسالة السابقة إذا كانت موجودة
		const previousMessage = PlayerMap.get(queue.id);
		if (previousMessage) {
			await previousMessage
				.delete()
				.catch((err) => console.error("Error deleting message:", err));
		}

		// إرسال الرسالة الجديدة وحفظها في PlayerMap
		const message = await queue.textChannel.send({
			embeds: [
				new EmbedBuilder()
					.setThumbnail(
						`https://cdn.discordapp.com/attachments/1307352957871718430/1307964771898884116/BeautyPlus__save.png?ex=673ce15e&is=673b8fde&hm=6fcd82c7efdcf62dffa8b39fe2cb1929d1598f4dd11b593628a0a4e4ae9ab6eb&`,
					)
					.setDescription(
						`> ↯ **Playing** \`${song.name}\` - **(**\`${song.formattedDuration}\`**)**`,
					)
					.addFields({
						name: "Requested by",
						value: `${song.user}`,
						inline: true,
					}),
			],
		});

		// تخزين الرسالة الجديدة
		PlayerMap.set(queue.id, message);
	} catch (err) {
		console.error("Error in playSong event:", err);
	}
});

module.exports = distube;
