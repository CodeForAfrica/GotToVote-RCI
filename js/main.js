
// Selection Criteria

var county_sel = document.getElementById("county_select");
var const_sel = document.getElementById("const_select");
var ward_sel = document.getElementById("ward_select");

var found_reg = document.getElementById("found-reg");
var loading_gif = document.getElementById("loading_gif");

var header_name = document.getElementById("header-name");

var county_code = 1;

var const_code = new Array();
var const_name = new Array();
var ward_code = new Array();
var ward_name = new Array();
var ward_reg_code = new Array();
var ward_reg_name = new Array();
var centre_code = new Array();
var centre_name = new Array();


//Fusion Table Variables
var json_result;

var get_url = "https://www.googleapis.com/fusiontables/v1/query?sql=";
var sql_1 = encodeURIComponent("SELECT * FROM ");
var sql_2 = encodeURIComponent(" WHERE Region_Code = "+county_code);
var api_key = "&key=AIzaSyAwvkIls5mQybyp2R3g4FGiVetNdeVjUeE";

county_sel.onchange = function () {

	if (county_sel.value==0) {
		//Selected Default
		county_sel.options[county_code].selected = "true";
	} else {
		if (county_sel.options[0].value==0) {
			county_sel.remove(0);
		}
		const_sel.innerHTML = "<option value=\"0\">Loading Districts... </option>";
		ward_sel.innerHTML = "<option value=\"0\">Loading Electoral Areas...</option>";

		header_name.innerHTML = unescape(toTitleCase(escape(county_sel.options[county_sel.selectedIndex].innerHTML)))+" Region";

		$("#reg-centres").html("<tr><td>"+
			"<p><img src=\"img/spinner.gif\" alt=\"\" />"+
			"Finding registration centres...</p></td></tr>");
		$("#found-reg").slideDown('fast');

		county_code = county_sel.value;
		sql_2 = encodeURIComponent(" WHERE Region_Code = "+county_code);
		run_get_centres("1NMs_iAwYIZqdEBDVVuxA7nN4BQlvQwNAgevtPkYx");
	}
}

const_sel.onchange = function() {
	if (const_sel.value==0) {
		//Do Nothing. No County Selected.
	} else {
		var del_no = ward_code.length;
		for (var i = 0; i < del_no; i++) {
			ward_code.pop();
			ward_name.pop();
		}
		del_no = ward_reg_code.length;
		for (var i = 0; i < del_no; i++) {
			ward_reg_code.pop();
			ward_reg_name.pop();
		}
		del_no = centre_code.length;
		for (var i = 0; i < del_no; i++) {
			centre_code.pop();
			centre_name.pop();
		}

		for (var i = 0; i < json_result.rows.length; i++){
			if (json_result.rows[i][3] == const_sel.value) {
				if (ward_code.length==0) {
					ward_code[0] = json_result.rows[i][5];
					ward_name[0] = json_result.rows[i][6];
					ward_reg_code[0] = json_result.rows[i][7];
					ward_reg_name[0] = json_result.rows[i][8];
					centre_code[0] = json_result.rows[i][0];
					centre_name[0] = json_result.rows[i][9];
				} else {
					var ward_already = 0;
					for (var c = 0; c < ward_code.length; c++) {
						if (ward_code[c] == json_result.rows[i][5]) {
							ward_already = 1;
						}
					}
					if (ward_already == 0) {
						ward_code[ward_code.length] = json_result.rows[i][5];
						ward_name[ward_code.length-1] = json_result.rows[i][6];
					}

					if (json_result.rows[i][5] == ward_code[0]) {
						var ward_reg_already = 0;
						for (var c = 0; c < ward_reg_code.length; c++) {
							if (ward_reg_code[c] == json_result.rows[i][7]) {
								ward_reg_already = 1;
							}
						}
						if (ward_reg_already == 0) {
							ward_reg_code[ward_reg_code.length] = json_result.rows[i][7];
							ward_reg_name[ward_reg_code.length-1] = json_result.rows[i][8];
						}

						centre_code[centre_code.length] = json_result.rows[i][0];
						centre_name[centre_code.length-1] = json_result.rows[i][9];
					}
				}
			}
		}

		ward_sel.innerHTML = "";
		for (var i = 0; i <ward_code.length; i++) {
			ward_sel.innerHTML += "<option value=\""+ward_code[i]+"\">"+toTitleCase(ward_name[i])+"</option>";
		}

		$("#reg-centres").html("");
		for (var i = 0; i <ward_reg_code.length; i++) {
			$("#reg-centres").html( $("#reg-centres").html()+
				"<tr><td><p>"+toTitleCase(ward_reg_name[i])+"</p></td></tr>");
		}
		$("#other-centres").html("");
		for (var i = 0; i <centre_code.length; i++) {
			$("#other-centres").html( $("#other-centres").html()+
				"<tr><td><p>"+toTitleCase(centre_name[i])+"</p></td></tr>");
		}

		header_name.innerHTML = unescape(toTitleCase(escape(ward_name[0])))+" Electoral Area";
	}
}

ward_sel.onchange = function() {
	if (const_sel.value==0) {
		//Do Nothing. No County Selected.
	} else {
		var del_no = ward_reg_code.length;
		for (var i = 0; i < del_no; i++) {
			ward_reg_code.pop();
			ward_reg_name.pop();
		}
		del_no = centre_code.length;
		for (var i = 0; i < del_no; i++) {
			centre_code.pop();
			centre_name.pop();
		}

		for (var i = 0; i < json_result.rows.length; i++){
			if (json_result.rows[i][5] == ward_sel.value) {
				var ward_reg_already = 0;
				for (var c = 0; c < ward_reg_code.length; c++) {
					if (ward_reg_code[c] == json_result.rows[i][7]) {
						ward_reg_already = 1;
					}
				}
				if (ward_reg_already == 0) {
					ward_reg_code[ward_reg_code.length] = json_result.rows[i][7];
					ward_reg_name[ward_reg_code.length-1] = json_result.rows[i][8];
				}

				centre_code[centre_code.length] = json_result.rows[i][0];
				centre_name[centre_code.length-1] = json_result.rows[i][9];
			}
		}

		$("#reg-centres").html("");
		for (var i = 0; i <ward_reg_code.length; i++) {
			$("#reg-centres").html( $("#reg-centres").html()+
				"<tr><td><p>"+toTitleCase(ward_reg_name[i])+"</p></td></tr>");
		}
		$("#other-centres").html("");
		for (var i = 0; i <centre_code.length; i++) {
			$("#other-centres").html( $("#other-centres").html()+
				"<tr><td><p>"+toTitleCase(centre_name[i])+"</p></td></tr>");
		}

		header_name.innerHTML = unescape(toTitleCase(escape(ward_sel.options[ward_sel.selectedIndex].text)))+" Electoral Area";
	}
}


// Fusion Table Script

function run_get_centres(table_id) {
	var xmlhttp;
	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			json_result = jQuery.parseJSON(xmlhttp.responseText);

			// Remove all the options from array
			var del_no = const_code.length;
			for (var i = 0; i < del_no; i++) {
				const_code.pop();
				const_name.pop();
			}
			del_no = ward_code.length;
			for (var i = 0; i < del_no; i++) {
				ward_code.pop();
				ward_name.pop();
			}
			del_no = ward_reg_code.length;
			for (var i = 0; i < del_no; i++) {
				ward_reg_code.pop();
				ward_reg_name.pop();
			}
			del_no = centre_code.length;
			for (var i = 0; i < del_no; i++) {
				centre_code.pop();
				centre_name.pop();
			}

			// Recurse all rows
			for (var i = 0; i < json_result.rows.length; i++){
				// Check if first row
				if (i==0) {
					const_code[0] = json_result.rows[0][3];
					const_name[0] = json_result.rows[0][4];
					ward_code[0] = json_result.rows[0][5];
					ward_name[0] = json_result.rows[0][6];
					ward_reg_code[0] = json_result.rows[0][7];
					ward_reg_name[0] = json_result.rows[0][8];
					centre_code[0] = json_result.rows[i][0];
					centre_name[0] = json_result.rows[i][9];
				// If not first row
				} else {
					var const_already = 0;
					// Recurse for all const_code set
					for (var c = 0; c < const_code.length; c++) {
						// If constituency already exists
						if (const_code[c] == json_result.rows[i][3]) {
							const_already = 1;
						}
					}
					// If constituency not set, set
					if (const_already == 0) {
						const_code[const_code.length] = json_result.rows[i][3];
						const_name[const_code.length-1] = json_result.rows[i][4];
					}

					// Set data for only the selected constituency
					if (json_result.rows[i][3] == const_code[0]) {
						var ward_already = 0;
						for (var c = 0; c < ward_code.length; c++) {
							if (ward_code[c] == json_result.rows[i][5]) {
								ward_already = 1;
							}
						}
						if (ward_already == 0) {
							ward_code[ward_code.length] = json_result.rows[i][5];
							ward_name[ward_code.length-1] = json_result.rows[i][6];
						}

						// Set data only for the selected ward
						if (json_result.rows[i][5] == ward_code[0]) {

							var ward_reg_already = 0;
							for (var c = 0; c < ward_reg_code.length; c++) {
								if (ward_reg_code[c] == json_result.rows[i][7]) {
									ward_reg_already = 1;
								}
							}
							if (ward_reg_already == 0) {
								ward_reg_code[ward_reg_code.length] = json_result.rows[i][7];
								ward_reg_name[ward_reg_code.length-1] = json_result.rows[i][8];
							}

							centre_code[centre_code.length] = json_result.rows[i][0];
							centre_name[centre_code.length-1] = json_result.rows[i][9];
						}
					}
				}
			}


			const_sel.innerHTML = "";
			for (var i = 0; i < const_code.length; i++) {
				const_sel.innerHTML += "<option value=\""+const_code[i]+"\">"+toTitleCase(const_name[i])+"</option>";
			}
			ward_sel.innerHTML = "";
			for (var i = 0; i <ward_code.length; i++) {
				ward_sel.innerHTML += "<option value=\""+ward_code[i]+"\">"+toTitleCase(ward_name[i])+"</option>";
			}

			$("#reg-centres").html("");
			for (var i = 0; i <ward_reg_code.length; i++) {
				$("#reg-centres").html( $("#reg-centres").html()+
					"<tr><td><p>"+toTitleCase(ward_reg_name[i])+"</p></td></tr>");
			}
			$("#other-centres").html("");
			for (var i = 0; i <centre_code.length; i++) {
				$("#other-centres").html( $("#other-centres").html()+
					"<tr><td><p>"+toTitleCase(centre_name[i])+"</p></td></tr>");
			}

			header_name.innerHTML = unescape(toTitleCase(escape(ward_name[0])))+" Electoral Area";

		}
	}
	xmlhttp.open("GET", get_url+sql_1+table_id+sql_2+api_key, true);
	xmlhttp.send();
}





// On Window load

window.onload = function() {

}

// Other Functions
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


function goToByScroll(id){
      // Remove "link" from the ID
    id = id.replace("link", "");
      // Scroll
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top},
        'slow');
}

$("#jumbotron > a").click(function(e) {
      // Prevent a page reload when a link is pressed
    e.preventDefault();
      // Call the scroll function
    goToByScroll($(this).attr("id"));
});
