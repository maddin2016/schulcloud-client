$(document).ready(function() {

	$('.card-preview').each(function (index, element) {
		console.log(index, element);
		var x = new EmbedJS({
			input : this
		});
		x.render();
	});
	$(".select-subjects").chosen();
});