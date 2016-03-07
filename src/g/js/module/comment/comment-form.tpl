<form class="ui-comment-form <%if(pid){%>ui-comment-reply-form<%}else{%>ui-comment-main-form<%}%> fix">
	<div class="ui-comment-input">
		<textarea name="content" <%if(pid){%>placeholder="回复 <%=nickname%>"<%}%>></textarea>
		<%if(pid){%>
		<input type="hidden" name="pid" value="<%=pid%>"/>
		<%}%>
	</div>
	<div class="ui-comment-action">
		<input type="submit" class="btn ui-comment-submit" value="发 布">
	</div>
</form>