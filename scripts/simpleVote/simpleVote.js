import { config } from '../simpleVoteConfig.js';
import { registerCommand, registerOverride } from 'ez:command';

const decoder = new TextDecoder();

const system = server.registerSystem(0, 0);

if (config.simpleVoteEnabled) {
    console.log("SimpleVote Version 1.0 Loaded! Made by PMK744");
    registerCommand("vote", config.voteCMDDescription, 0);
    registerOverride("vote", [], function () {
        if (this.player) {
            vote(this.player);
        } else {
            console.log('This command can be only used in game.');
        }
    });
}

async function vote(votingPlayer) {
    let checkVote = await HttpRequest("GET", `https://minecraftpocket-servers.com/api/?object=votes&element=claim&key=${config.voteAPIKey}&username=${votingPlayer.name}`);
    let checkData = new Uint8Array(await checkVote.data);
    let voteData = decoder.decode(checkData);
    if (voteData == 1) {
		system.executeCommand(`tellraw "${votingPlayer.name}" {"rawtext": [{"text": "${config.VoteMsgRewardClaim}"}]}`, () => {});
		system.executeCommand(`give "${votingPlayer.name}" ${config.voteReward}`, () => {});
		setTimeout(() => {
			HttpRequest("GET", `https://minecraftpocket-servers.com/api/?action=post&object=votes&element=claim&key=${config.voteAPIKey}&username=${votingPlayer.name}`);
		},10)
    } else if (voteData == 2) {
        system.executeCommand(`tellraw "${votingPlayer.name}" {"rawtext": [{"text": "${config.voteMsgAlreadyVoted}"}]}`, () => {});
    } else if (voteData == 0) {
        system.executeCommand(`tellraw "${votingPlayer.name}" {"rawtext": [{"text": "${config.voteMsgDescription}§r §l§9${config.voteWebsite}§r"}]}`, () => {});
    } else {
        console.log("Error: server key not found");
		system.executeCommand(`tellraw "${votingPlayer.name}" {"rawtext": [{"text": "§cThis server's vote system has not been set up yet.\nError: server key not found"}]}`, () => {});
	}
} 