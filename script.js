window.emoji = {

	/** 编辑框对象 */
	edit: null,

	/** 最后光标*/
	lastRange: null,

	/** 插入内容 */
	insert: function(html) {
		this.edit.focus();
		var el = document.createElement('div');
		el.innerHTML = html;
		var selection = getSelection();
		if (this.lastRange) {
			selection.removeAllRanges();
			selection.addRange(this.lastRange);
		}
		var range = selection.getRangeAt(0);
		range.deleteContents();
		var frag = document.createDocumentFragment(), node, lastNode;
		while ( (node = el.firstChild) ) {
			lastNode = frag.appendChild(node);
		}
		range.insertNode(frag);
		if (lastNode) {
			range = range.cloneRange();
			range.setStartAfter(lastNode);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
		}
		this.lastRange = selection.getRangeAt(0);
	},

	/** 设置光标 */
	setRange: function(startOffset,endOffset) {
		if(!this.lastRange) this.lastRange = document.createRange();
		this.lastRange.selectNodeContents(this.edit);
		if(!isNaN(startOffset)) this.lastRange.setStart(this.edit, startOffset);
		if(!isNaN(endOffset)) this.lastRange.setEnd(this.edit, endOffset);
		var selection = getSelection();
		selection.removeAllRanges();
		selection.addRange(this.lastRange);
	},

	/** 保存光标 */
	saveRange: function() {
		try{
			emoji.lastRange = getSelection().getRangeAt(0);
		}catch(e){}
	},

	/** 鼠标事件 */
	mouse: function() {
		var range = getSelection().rangeCount?getSelection().getRangeAt(0):0;
		if (emoji.lastRange&&(range.commonAncestorContainer == emoji.edit||range.commonAncestorContainer.parentNode == emoji.edit))
			emoji.saveRange();
	}
};

$(function() {
	emoji.edit = document.getElementById('comments_edit');
	$('#comments_more img').click(function() {
		emoji.insert(this.outerHTML);
	});
	$('#comments_edit')
		.mouseup(emoji.mouse)
		.mouseout(emoji.mouse)
		.keyup(emoji.saveRange);
});