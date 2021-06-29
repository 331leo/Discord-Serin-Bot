const MusicPlayer = require("../Object/MusicPlayer");
const Music = require("../Object/Music");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");

const createPlayer = (guild, voiceChannel) => {
  const client = guild.client;
  let player = client._players.get(guild.id);
  if (!player) {
    player = new MusicPlayer(client, voiceChannel);
    client._players.set(guild.id, player);
  }
  return player;
};

const intertSong = async ({
  player,
  songID,
  requestor,
  sendMessageMethod: sendMessage,
}) => {
  const musicData = await ytdl.getBasicInfo(songID);
  if (!musicData) return sendMessage("음악 정보를 불러올 수 없습니다!");
  player.playlist.push(music);
  if (player.isPlay) {
    sendMessage({
      embeds: [
        music.embed.setAuthor("📥 노래 추가되었습니다.").setColor("BLUE"),
      ],
    });
  } else {
    player.next();
  }
  return;
};

async function insertYoutubePlaylist({
  player,
  playlistID,
  requestor,
  sendMessageMethod: sendMessage,
}) {
  const musicList = await ytpl(playlistID)
    .then(
      (playList) =>
        playList.items?.map((video) => new Music(video, { requestor })) || []
    )
    .catch(() => []); // bypass findPlayListID error.
  if (musicList <= 0) return sendMessage("재생목록을 불러올 수 없습니다!");
  player.playlist.push(...musicList);
  sendMessage(`🗃️ ${musicList.length}개의 곡을 재생 목록에 추가하였습니다.`);
  if (!player.isPlay) player.next();
}

module.exports = { intertSong, createPlayer, insertYoutubePlaylist };
