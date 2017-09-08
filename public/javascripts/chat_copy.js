document.writeln("<link rel='stylesheet' type='text/css' href='http://211.150.71.181:3000/javascripts/extjs/resources/css/ext-all.css'/>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/socket.io/socket.io.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/logic.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/session.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/msgstore.js'></script>");
//document.writeln("<script type='text/javascript' src='/javascripts/view.js'></script>");

document.writeln("<link rel='stylesheet' type='text/css' href='http://211.150.71.181:3000/stylesheets/msg.css'/>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/LoginWin.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/sender.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/MaintabWin.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/ConversationList.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/ContactList.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/detail.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/Conversation.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/meeting.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/Candidate.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/member.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/FloatWin.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/Login.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/msg.js'></script>");

document.writeln("<link href='http://211.150.71.181:3000/stylesheets/lrtk.css' rel='stylesheet' type='text/css' />");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/plugin_js_q.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/guest.js'></script>");
document.writeln("<script type='text/javascript' src='http://211.150.71.181:3000/javascripts/guestConversation.js'></script>");
document.writeln("<script type='text/javascript' src='http://www.coding123.net/getip.ashx?js=1'></script>");

Ext.onReady(function(){	

	/*var login=Ext.create('LoginWin',{});
	login.show();*/ 

	var mydiv=document.createElement("div");
	mydiv.setAttribute("id","plugin_qq_box");
	mydiv.setAttribute("style","cursor:pointer");
	var mytxt=document.createElement("marquee");
	mytxt.setAttribute("id","inner_box");
	mytxt.innerHTML="双击在线咨询！";
	mytxt.setAttribute("onmouseover","this.stop()");
	mytxt.setAttribute("onmouseout","this.start()");
	mytxt.setAttribute("scrollamount","3");
	mydiv.appendChild(mytxt);
	document.body.appendChild(mydiv);

	qq_plugin.set({
		top : '100',		//设置插件的高度
		ip  : ip,
	});
});










