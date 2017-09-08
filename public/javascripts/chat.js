document.writeln("<link rel='stylesheet' type='text/css' href='/javascripts/extjs/resources/css/ext-all.css'/>");
document.writeln("<script type='text/javascript' src='/socket.io/socket.io.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/logic.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/session.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/msgstore.js'></script>");
//document.writeln("<script type='text/javascript' src='/javascripts/view.js'></script>");

document.writeln("<link rel='stylesheet' type='text/css' href='/stylesheets/msg.css'/>");
document.writeln("<script type='text/javascript' src='/javascripts/LoginWin.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/sender.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/MaintabWin.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/ConversationList.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/ContactList.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/detail.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/Conversation.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/meeting.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/Candidate.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/member.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/FloatWin.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/Login.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/msg.js'></script>");
 

document.writeln("<link href='/stylesheets/lrtk.css' rel='stylesheet' type='text/css' />");
document.writeln("<script type='text/javascript' src='/javascripts/plugin_js_q.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/guest.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/guestConversation.js'></script>");
document.writeln("<script type='text/javascript' src='/javascripts/CINCCBar.js'></script>");
document.writeln("<script type='text/javascript' src='http://www.coding123.net/getip.ashx?js=1'></script>");

Ext.onReady(function(){	
	 
	var login=Ext.create('LoginWin',{});
	login.show();

	/*var mydiv=document.createElement("div");
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
	});*/

});










