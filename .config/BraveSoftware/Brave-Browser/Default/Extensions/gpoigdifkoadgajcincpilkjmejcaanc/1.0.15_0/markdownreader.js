(function(document) {
	
	//忽略HTML代码
	if (document.doctype) return;

    document.write('<!DOCTYPE html><html><head><body><div id="container" class="viewport-flip"><div id="text-container" class="content flip" style="display:none;"></div><div id="markdown-container" class="content flip"></div></div><div id="markdown-outline"></div><div id="markdown-backTop" onclick="window.scrollTo(0,0);"></div></body></html>');
    document.close();

	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = chrome.extension.getURL('markdownreader.css');
	document.head.appendChild(link);

	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = chrome.extension.getURL('hljs.min.css');
	document.head.appendChild(link);

	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = chrome.extension.getURL('katex.min.css');
	document.head.appendChild(link);

	window.onresize = showOutline;

	var jTextContainer = $('#text-container');
	var jMarkdownContainer = $('#markdown-container');
	var jOutline = $('#markdown-outline');

	var isMarkdownMode = true;
	$(document).on('dblclick',toggleMode);

	function toggleMode(e){
		// 内容区外点击才会切换模式
		if($(e.target).closest('.content').length === 0){
			if(isMarkdownMode){
				jMarkdownContainer.addClass('out').removeClass('in');
				isMarkdownMode = false;
				jMarkdownContainer.one('webkitAnimationEnd', function(){
					jTextContainer.show().addClass('in').removeClass('out');
					jMarkdownContainer.hide();
				});
			}
			else{
				jTextContainer.addClass('out').removeClass('in');
				jTextContainer.one('webkitAnimationEnd', function(){
					jMarkdownContainer.show().addClass('in').removeClass('out');
					jTextContainer.hide();
					isMarkdownMode = true;
				});
			}
			return false;
		}
	}

	jMarkdownContainer.on('webkitAnimationEnd', function(){
		if(isMarkdownMode){
			showOutline();
		}
		else{
			hideOutline();
		}
	});

	var markdownConverter = new showdown.Converter({
		tables: true,
		strikethrough: true,
		simplifiedAutoLink: true,
		tasklists: true,
		literalMidWordUnderscores: true
	});
	var lastText = null;
	var outlineCount = 0;

	function updateMarkdown(text) {
		if (text !== lastText) {
			lastText = text;
			jTextContainer.text(text.replace(/\r\n?|\r?\n/g, '\r\n'));
			jMarkdownContainer.html(markdownConverter.makeHtml(lastText));
	        $('code').each(function(i, block){
	        	if(this.parentNode && /^pre$/i.test(this.parentNode.tagName)){
	        		hljs.highlightBlock(block);
	        	}
	        	else{
	        		$(this).addClass('inline');
	        	}
	        })
			updateOutline();
		}
	}

	function updateOutline() {
		var arrAllHeader = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
		var arrOutline = ['<ul>'];
		var header, headerText;
		var id = 0;
		var level = 0,
			lastLevel = 1;
		var levelCount = 0;
		for (var i = 0, c = arrAllHeader.length; i < c; i++) {
			header = arrAllHeader[i];
			headerText = header.innerText;

			header.setAttribute('id', id);

			level = header.tagName.match(/^h(\d)$/i)[1];
			levelCount = level - lastLevel;

			if (levelCount > 0) {
				for (var j = 0; j < levelCount; j++) {
					arrOutline.push('<ul>');
				}
			} else if (levelCount < 0) {
				levelCount *= -1;
				for (var j = 0; j < levelCount; j++) {
					arrOutline.push('</ul>');
				}
			};
			arrOutline.push('<li>');
			arrOutline.push('<a href="#' + id + '">' + headerText + '</a>');
			arrOutline.push('</li>');
			lastLevel = level;
			id++;
		}
		arrOutline.push('</ul>')
		outlineCount = id;
		if(outlineCount > 0){
			jOutline.html(arrOutline.join(''));
            jOutline.find('ul').each(function(i,n){
                var jThis = $(this);
                if(jThis.children('li').length === 0){
                    jThis.replaceWith(jThis.children());
                }
            });
			showOutline();
		}
		else{
			hideOutline();
		}
	}

	function showOutline() {
		if(outlineCount > 0){
			var offset = jMarkdownContainer.offset();
			jOutline.css({
				left: offset.left + jMarkdownContainer.outerWidth() + 10 + 'px',
				maxHeight: document.body.clientHeight - 30
			}).show();
		}
	}

	function hideOutline(){
		jOutline.hide();
	}

	var xmlhttp = new XMLHttpRequest();
	var fileurl = location.href,
		bLocalFile = /^file:\/\//i.test(fileurl);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status != 404) {
			updateMarkdown(xmlhttp.responseText);
		}
	};

	function checkUpdate() {
		xmlhttp.abort();
		xmlhttp.open("GET", fileurl + '?rnd=' + new Date().getTime(), true);
		xmlhttp.send(null);
		if (bLocalFile) setTimeout(checkUpdate, 500);
	}

	checkUpdate();

}(document));
