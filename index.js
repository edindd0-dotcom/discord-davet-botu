const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildInvites]
});

const invites = new Collection();
const ROL_ID = 1482350320494448859
const HEDEF_DAVET = 2;

client.on('ready', async () => {
    client.guilds.cache.forEach(async (guild) => {
        const firstInvites = await guild.invites.fetch().catch(() => new Collection());
        invites.set(guild.id, new Collection(firstInvites.map((inv) => [inv.code, inv.uses])));
    });
    console.log(`${client.user.tag} GitHub üzerinden yayında!`);
});

client.on('guildMemberAdd', async (member) => {
    const newInvites = await member.guild.invites.fetch().catch(() => new Collection());
    const oldInvites = invites.get(member.guild.id);
    const invite = newInvites.find(i => i.uses > (oldInvites?.get(i.code) || 0));
    
    if (invite) {
        const inviter = invite.inviter;
        const userInvites = newInvites.filter(i => i.inviter?.id === inviter.id).reduce((a, b) => a + b.uses, 0);

        if (userInvites >= HEDEF_DAVET) {
            const role = member.guild.roles.cache.get(ROL_ID);
            if (role) {
                const inviterMember = await member.guild.members.fetch(inviter.id).catch(() => null);
                if (inviterMember) await inviterMember.roles.add(role).catch(console.error);
            }
        }
    }
    invites.set(member.guild.id, new Collection(newInvites.map((inv) => [inv.code, inv.uses])));
});

client.login(process.env.TOKEN);
