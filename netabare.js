langResources['Anti-Spoiler'] = ['ネタバレフィルタ','剧透过滤器'];
langResources['Add'] =	['追加','添加'];
langResources['List of filters'] = ['一覧','过滤列表'];
langResources['Enable'] = ['有効化','启用'];
langResources['Disable'] = ['無効化','禁用'];

var netabare_filters;

function ntbrDumpFilters() {
	var str = netabare_filters.map(function(f) {
		return (f[0]?1:0) + ':' + f[1];
	}).join("\n");
	writeCookie("netabare_filters", str, 3652);
}

function ntbrLoadFilters() {
	str = readCookie("netabare_filters");
	netabare_filters = str ? str.split("\n").map(function(f) {
		var sp = f.indexOf(':');
		return [!!parseInt(f.substring(0,sp)), f.substring(sp+1)];
	}) : [];
}

function ntbrAddFilter(filter) {
	netabare_filters.push([true, filter]);
	ntbrDumpFilters();
	ntbrUpdateMisc();
}

function ntbrRemoveFilter(idx) {
	netabare_filters.splice(idx,1);
	ntbrDumpFilters();
	ntbrUpdateMisc();
}

function ntbrToggleFilter(idx) {
	netabare_filters[idx][0] = !netabare_filters[idx][0];
	ntbrDumpFilters();
	ntbrUpdateMisc();
}

function ntbrUpdateMisc() {
	var target = $('netabare_list');
	var str = "";
	for(var i = 0; i < netabare_filters.length; ++i) {
		var style = netabare_filters[i][0] ? 'color:black;' : 'color:lightgray;';
		var toggle = netabare_filters[i][0] ? _('Disable') : _('Enable');
		str += '<li style="'+style+'">' + netabare_filters[i][1] + '&nbsp;&nbsp;<a href="javascript:ntbrToggleFilter('+i+');">['+toggle+']</a>'+
			'&nbsp;&nbsp;<a class="close" href="javascript:ntbrRemoveFilter('+i+');">'+
			'<img style="position:relative; top:2px;" src="images/clr.png"></a></li>';
	}
	target.innerHTML = str;
}

ntbrLoadFilters();

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'netabare_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Anti-Spoiler')+'</b></a>' +
			'<form id="netabare_pref" style="display:none" onSubmit="ntbrAddFilter($(\'newFilter\').value); return false;">' +
			_('List of filters')+':<ul id="netabare_list"></ul>' +
			'<input type="text" size="50" id="newFilter" value="">' +
			'<input type="submit" value="'+_('Add')+'"></form>';
		$("pref").appendChild(e);
		ntbrUpdateMisc();
	},
	newMessageElement: function(s, tw, twNodeId) {
		for(var i = 0; i < netabare_filters.length; ++i) {
			if(netabare_filters[i][0] && tw.text.match(netabare_filters[i][1])) {
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
   }
});
