define([
	'g/js/core/widget', 
	'g/js/core/art', 
	'g/js/module/user', 
	'm/js/widget/dialog',
	'm/js/widget/idialog',
	'g/js/util/fn', 
	'g/js/widget/pagelist', 
	'g/js/util/serialize'
], function(Widget, Art, User, Dialog, IDialog, Fn, PageList, Serialize){
	var Klass = Widget.extend({
		template: require.text('m/js/module/comment/comment.tpl'), //容器
		formTpl: require.text('m/js/module/comment/comment-form.tpl'), //评论表单
		listTpl: require.text('m/js/module/comment/comment-list.tpl'), //评论列表
		renderMethod: 'append',
		model: {
			tid: 0,
			hasPaging: false, //有没有分页
			pageSize: 10,
			sort: 0,
			ttype: 0,
			pageNum: 1,
			uid: User.uid(),
			moreUrl: '' //更多评论
		},
		events: {
			'click .ui-comment-reply': function(e){
				e.preventDefault();
				var self = this;
				var $item = $(e.target).closest('.ui-comment-item');
				var $form = $item.find('.ui-comment-reply-form');
				var unick = $item.find('.ui-comment-user-nickname').text();
				
				self.renderForm({
					pid: $item.data('cid'),
					nickname: unick
				});
			},
			'click .ui-comment-del': function(e){
				e.preventDefault();
				var self = this;
				var $item = $(e.target).closest('.ui-comment-item');
				Dialog.confirm('确认要删除这条评论吗?', function(){
					self.delComment({
						cmtId: $item.data('cid')
					}, function(res){
						$item.remove();
					});
				})
			}
		},
		initialize: function(config){
			var self = this;
			config = config || {};
			Klass.superClass.initialize.apply(self, arguments);
			self.formTpl = config.formTpl || self.formTpl;
			self.listTpl = config.listTpl || self.listTpl;
			self.render();
		},
		render: function(){
			var self = this;
			Klass.superClass.render.apply(self, arguments);
			self.$commentForm = self.find('.ui-comment-form');
			self.$commentList = self.find('.ui-comment-list');
			self.$commentPaging = self.find('.ui-comment-paging');
			self.$commentMore = self.find('.ui-comment-more');
			
			//渲染主评论框
			//self.renderForm();
			
			//渲染评论列表和分页控件
			var oPageList = new PageList({
				template2: self.listTpl, //评论列表tpl模板
				targetNode2: self.$commentList, //评论列表依附标签
				targetNode: self.$commentPaging,
				model: self.model,
				getCurrentPageData: function(page, callback){
					var me = this;
					self.model.pageNum = page;
					var param = Fn.iExtend({
						tid: 0,
						sort: 0,
						pageNum: 1,
						pageSize: 10,
						ttype: 0
					}, self.model);
					$.getJSON("/cmt/getComments.do", param, function(res){
						if (res.code == 0 && res.data) {
							me.total(Math.ceil(res.data.totalCount / self.model.pageSize));
							callback && callback(res.data.dataList);
						}
					});
				}
			});
			oPageList.bind('render', function(){
				if (!self.model.hasPaging && oPageList.total() > 1) {
					self.$commentMore.show();
				}
				else if (self.model.hasPaging && oPageList.total() > 1) {
					self.$commentPaging.show();
				}
			})
			oPageList.go(1);
			self.pagelist = oPageList;
			
			return self;
		},
		renderForm: function(o){
			o = o || {};
			var self = this;
			var oDialog = IDialog.fullayer(Art.compile(self.formTpl)($.extend({
				pid: 0,
				nickname: '',
			}, o)), {
				title: '发评论',
				events: {
					'click .ui-comment-submit': function(e){
						e.preventDefault();
						var me = this;
						var $form = $(e.target).closest('form');
						var $ta = $form.find('[name=content]');
						var param = Serialize.arrayToJson($form.serializeArray());
						if ($.trim(param.content) == '') {
							return;
						}
						self.sendComment(param, function(data){
							var renderMethod = 'append';
							var targetNode = self.find('.ui-comment-list');
							if (self.element.find('.ui-comment-item').length) {
								targetNode = self.element.find('.ui-comment-item').first();
								renderMethod = 'before';
							}
							self.pagelist &&
							self.pagelist.render([data], {
								isAddItem: true,
								renderMethod: renderMethod,
								targetNode: targetNode
							})
							//...
							me.close(true);
						});
					}
				}
			});
		},
		sendComment: function(o, cb){
			o = o || {};
			var self = this;
			var param = $.extend({
				tid: self.model.tid,
				content: '',
				ttype: self.model.ttype
			}, o);
			$.post('/cmt/comment.do', param, function(res){
				if (res.code == 0) {
					cb && cb(res.data);
					self.trigger('comment:success');
				}
				else {
					Dialog.alert(res.msg);
				}
			}, 'json');
		},
		delComment: function(o, cb){
			o = o || {};
			var self = this;
			var param = $.extend({
				cmtId: 0,
				ttype: self.model.ttype
			}, o);
			$.getJSON('/cmt/delComment.do', param, function(res){
				if (res.code == 0) {
					cb && cb(res);
					self.trigger('delComment:success');
				}
				else {
					Dialog.alert(res.msg);
				}
			});
		}
	})
	return Klass;
})
