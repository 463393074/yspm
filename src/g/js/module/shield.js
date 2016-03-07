define([
    'g/js/core/widget',
    'g/js/core/art',
    'g/js/module/user',
    'g/js/util/util'
], function(Widget, Art, LoginUtil, Util) {
    var $body = $(document.body);
    var Klass = Widget.extend({
        template : require.text("m/js/module/shield.tpl"),
        targetNode : $body,
        model : {
            targetType: 0,
            targetId:0
        },
        events : {
            "click .go-back" : function(e) {
                this.close();
            },

            "click .submit" : function(e) {
                var self = this;
                var $content = $(e.target).closest(".content");
                var $errmsg = $content.find(".err-msg");
                var $form = $(e.target).closest("form");
                var params = Util.arrayToJson($form.serializeArray());
                var t = null;
                if (!params.reportType) {
                    $errmsg.text("必须选择一项举报类型");
                    t && clearTimeout(t);
                    t = setTimeout( function(){
                        $errmsg.text("");
                    }, 1000);
                    return;
                }
                var p = $.extend({},{
                    targetType : self.model.targetType,
                    targetId : self.model.targetId
                },params);
                $.post("/feedback/reportSpam.do", p, function(res) {
                    if (res.code == 0) {
                        self.close();
                    } else {
                        $errmsg.text(res.msg);
                        t && clearTimeout(t);
                        t = setTimeout(function(){
                            $errmsg.text("");
                        }, 1000);
                    }
                }, "json");
            }
        },
        initialize: function(config) {
            var self = this;
            Klass.superClass.initialize.call(self, config || {});
            self.element = $(Art.compile(self.template)({}));
            self.targetNode.append(self.element);
            self.delegate(self.events, self.element);
        },

        close: function() {
            var self = this;
            self.element.remove();
            if (self.model.invoker) {
                self.model.invoker.recoverWrap();
            }
        }
    });
    return Klass;
});