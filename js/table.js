// table.js
// Display the full table view when clicking on a thumbnail version of a table in the mobile view
$(function(){
	$("table.wide-datatable").on("click", function(){
		$("html").toggleClass( $(this).attr("class") );
	});
});