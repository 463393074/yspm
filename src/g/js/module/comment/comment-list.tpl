<%
var len = data.length;
if(len){
	data.forEach(function(item, i){
	    var user = item.cmtUser || {};
	    var puser = item.pcmtUser || {};
%>
<div class="ui-comment-item" data-cid="<%=item.commentId%>">
    <div class="ui-comment-user-pic">
        <a href="/home/<%=user.domain%>" target="_blank" title=""><img src="<%=user.midAvatar%>"/></a>
    </div>
	<div class="ui-comment-cont fix">
	    <div class="ui-comment-txt">
	    	<span class="ui-comment-user">
	        	<a href="/home/<%=user.domain%>" target="_blank" class="ui-comment-user-nickname"><%=user.nickname%></a>
			</span>
			<%if(puser.userId){%>
			<span class="ui-comment-user">
				回复了 <a href="/home/<%=puser.domain%>" target="_blank" title=""><%=puser.nickname%></a><%}%>
			</span>
			<%=item.content%>
	    </div>
	    <div class="ui-comment-fn fix">
			<div class="ui-comment-op fr">
		        <%if(uid == user.userId){%>
		        <a href="#" class="ui-comment-del">删除</a>
		        <%};%>
		        <a href="#" class="ui-comment-reply">回复</a>
			</div>
	    	<div class="ui-comment-time">
	    		<span><%=Util.release(item.createTime)%></span>
	    	</div>
	    </div>
	</div>
</div>
<%});%>
<%}else{%>
<%}%>