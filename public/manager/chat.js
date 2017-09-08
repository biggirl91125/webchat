document.writeln("<link rel='stylesheet' type='text/css' href='/javascripts/extjs/resources/css/ext-all.css'/>");
document.writeln("<link rel='stylesheet' type='text/css' href='/stylesheets/wechat.css'/>");
document.writeln("<script type='text/javascript' src='/socket.io/socket.io.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/logic.js'></script>");

document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Basic/BasicPanel.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Basic/BasicGridPanel.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Basic/BasicWindow.js'></script>");

document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Login/LoginWindow.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Login/LoginForm.js'></script>");

document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Container/GridFramework.js'></script>");

document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Grid/GroupsGridPanel.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Modify/ModifyPanel.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/UI/Header/Header.js'></script>");


document.writeln("<script type='text/javascript' src='/manager/Wechat/Control/StoreControl.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/Control/GridControl.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/Store/DragGridStore.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/Store/GroupsGridStore.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/Store/MembersGridStore.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/Store/TeamsStore.js'></script>");


document.writeln("<script type='text/javascript' src='/manager/Wechat/Util/Event.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Wechat/Util/Corp.js'></script>");



//document.writeln("<link rel='stylesheet' type='text/css' href='/stylesheets/msg.css'/>");
//document.writeln("<script type='text/javascript' src='/managers/LoginWin.js'></script>");
/*document.writeln("<script type='text/javascript' src='/manager/sender.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/MaintabWin.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/ConversationList.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/ContactList.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/detail.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Conversation.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/meeting.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Candidate.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/member.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/FloatWin.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/Login.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/msg.js'></script>");

document.writeln("<link href='/stylesheets/lrtk.css' rel='stylesheet' type='text/css' />");
document.writeln("<script type='text/javascript' src='/manager/plugin_js_q.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/guest.js'></script>");
document.writeln("<script type='text/javascript' src='/manager/guestConversation.js'></script>");
document.writeln("<script type='text/javascript' src='http://www.coding123.net/getip.ashx?js=1'></script>");*/

Ext.onReady(function(){	  
	var login=Ext.create('Wechat.UI.Login.LoginWindow',{});
	console.info(login);
	login.show();


});
