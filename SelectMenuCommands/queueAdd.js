const { MessageSelectMenu, MessageActionRow } = require("discord.js");
const { createPlayer, intertSong } = require("../utils/musicUtil");

module.exports = {
  name: "곡추가",
  execute: async ({ args, msg, executor, interaction }) => {
    if (!msg.mentions.has(executor.id))
      return interaction.reply({
        content: "명령어 실행자가 아닙니다.",
        ephemeral: true,
      });
    if (!executor.voice.channel)
      return interaction.reply({
        content: "보이스 채널에 접속하세요",
        ephemeral: true,
      });
    const player = createPlayer(msg.guild, executor.voice.channel);
    if (executor.voice.channel.id !== player.voice.id)
      return interaction.reply({
        content: "봇이 입장한 보이스 채널에 접속하세요.",
        ephemeral: true,
      });
    player.responseChannel = msg.channel;
    const selectSongs = args.split("&");
    selectSongs.forEach((songID) => {
      intertSong({
        player,
        songID,
        requestor: executor,
        sendMessageMethod: interaction.followUp.bind(interaction),
      });
    });

    let selectComponent = new MessageSelectMenu(interaction.component);
    const selectDefaultOption = selectComponent.options.map((option) => {
      if (selectSongs.includes(option.value)) option.default = true;
      return option;
    });
    selectComponent.options = selectDefaultOption;
    selectComponent.setDisabled(true);
    const actionRow = new MessageActionRow({ components: [selectComponent] });
    interaction.update({
      content: `💽  ${executor} 님이 음악을 선택하셨습니다.`,
      components: [actionRow],
    });
  },
};
