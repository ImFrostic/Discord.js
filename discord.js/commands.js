let info;
let client;
let embed;
let commands = {}

//

function parse_embed(message, replywith){
	replywith["Description"] = replywith["Description"] || "";
	replywith["Color"] = replywith["Color"] || info.MainColor;
	replywith["Title"] = replywith["Title"] || "";

	let e = new embed()
		.setTitle(replywith["Title"])
		.setColor(replywith["Color"])
		.setDescription(replywith["Description"])
		.setFooter(`Sent by <@${message.author.id}>`);

	if (replywith["Fields"]){
		replywith["Fields"].forEach(function(item){
			e.addField(item.Name || "Empty!", item.Description || "Empty!");
		})
	}

	return e
}

function add_command(name, description, func){
	commands[name.toLowerCase()] = {
		Function: func,
		Name: name,
		Description: description || "No description!"
	};
}

function start_up(){

	//
	add_command("Ping", "Ping!", function(){ return {Title: "pong!"} });
	add_command("Pong", "Pong!", function(){ return {Title: "ping!"} });
	//

	//
	add_command("Gay", "Get the gayness of the user", function(message, content){ 
		let member = message.mentions.users.first() || message.author
		let number = Math.floor(Math.random(1, 100)*100)
		if (member.id == 149740565351759873){ number = 0 }
		return {Description: `<@${member.id}> is ${number}% gay.`} 
	});
	add_command("Cool", "Get the coolness of the user", function(message, content){ 
		let member = message.mentions.users.first() || message.author
		let number = Math.floor(Math.random(1, 100)*100)
		if (member.id == 149740565351759873){ number = 100 }
		return {Description: `<@${member.id}> is ${number}% cool.`} 
	});

	let items = ["tiny", "small", "medium", "big", "biggest"];
	add_command("Size", "Get the size of the user", function(message, content){
		let member = message.mentions.users.first() || message.author
		let size = items[Math.floor(Math.random()*items.length)];
		if (member.id == 149740565351759873){ size = "biggest" }
		return {Description: `<@${member.id}>'s pp size is ${size}.`};
	})

	let answers = [
			"It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.",
			"As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
			"Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
			"Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.",
			"Outlook not so good.", "Very doubtful.", "No."
		];
	add_command("8ball", "Get the wise answer of the magic 8ball.", function(){
		return {Title: answers[Math.floor(Math.random()*answers.length)]};
	})
	//
	add_command("Help","Get help!", function(message, content){
		let helps = [];
		for (const [key, item] of Object.entries(commands)) {
			helps.push({Name: item.Name, Description: item.Description});
		}
		message.author.send(parse_embed(message, {
			Title: "Heres a list of commands!",
			Fields: helps
		}));
		return {Title: "Sending you a list of commands in your DMs!"};
	})
}

const notfound = {Function: function(){}};

module.exports = function(me, i, RichEmbed) {
	info = i;
	client = me;
	embed = RichEmbed
	start_up();

	return function(message){
		let first_word = message.content.split(" ")[0].substring(1);
		return (commands[first_word.toLowerCase()] || notfound)
				.Function(
					message, 
					message.content.substring(first_word.length + 2)
				);
	}

}