const mch = require('mc-heads-api');

async function logPlayer() {
  const player = await mch.getPlayer('labb1e'); // username or uuid

  console.log(player.username);
}

logPlayer();