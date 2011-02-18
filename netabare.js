langResources['Anti-Spoiler'] = ['ネタバレフィルタ','Anti-Spoiler'];
langResources['Add'] =	['追加','添加'];
langResources['List of filters'] = ['一覧'];
var cnt = 0;
var netabare_filters = readCookie('netabare_filters');
netabare_filters = netabare_filters ? netabare_filters.split("\n") : [];

function ntbrAddFilter(filter) {
	netabare_filters.push(filter);
	writeCookie("netabare_filters", netabare_filters.join("\n"), 3652);
	ntbrUpdateMisc();
}

function ntbrRemoveFilter(filter) {
	for(var i = 0; i < netabare_filters.length; ++i) {
		if(netabare_filters[i] == filter) {
			netabare_filters.splice(i, 1);
			break;
		}
	}
	writeCookie("netabare_filters", netabare_filters.join("\n"), 3652);
	ntbrUpdateMisc();
}

function ntbrUpdateMisc() {
	var target = $('netabare_list');
	target.innerHTML = netabare_filters.map(function(f) {
		return "<li>" + f + '<a class="close" href="javascript:ntbrRemoveFilter(\''+f+'\');">'+
			'<img style="position:relative; top:2px;" src="images/clr.png"></a></li>';
	}).join("");
}

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'netabare_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Anti-Spoiler')+'</b></a>' +
			'<form id="netabare_pref" style="display:none" onSubmit="ntbrAddFilter($(\'newFilter\').value); return false;">' +
			_('List of filters')+':<ul id="netabare_list">' +
			'</ul><input type="text" size="50" id="newFilter" value="">' +
			'<input type="submit" value="'+_('Add')+'"></form>';
		$("pref").appendChild(e);
		ntbrUpdateMisc();
	},
	newMessageElement: function(s, tw, twNodeId) {
		if(cnt > 5) return;
		if(tw.text.match(/osa_k/)) {
			cnt++;
			var eid = twNodeId+'-'+(tw.id_str||tw.id);
			for(i = 0; i < s.childNodes.length; ++i) {
				var child = s.childNodes[i];
				if(child.id == "text-"+eid) {
					child.orgHTML = child.innerHTML;
					child.innerHTML = "<span style=\"font-weight:bold;color:red;\">&lt;censored&gt;</span>";
					child.onclick = function() {
						this.innerHTML = this.orgHTML;
					};
					break;
				}
			}
		}
   }
});
