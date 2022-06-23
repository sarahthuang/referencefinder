//index.js

//Creating Data
var addContent = function(submission) { //Ajax POST function to submit data
    $.ajax({
        type: "POST",
        url: "add",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(submission),
        success: function(result) { //takes python result
            formData(result['id'], submission);
        },
        error: function(request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

var formCard = function(id, title, source, media, col, colors) { //Appends Bootstrap Cards to HTML
    title == "" ? title = 'source' : title = title
    $("#display_row").append("<div class='card "+col+"' id='card_"+id+"'style='width: 16.5rem;'><img class='card-img-top' src='"+media+"' alt='Card image cap'><div class='card-body'><h5 class='card-title' id='card_title_"+id+"'><a href='"+source+"'>"+title+"</a></h5><div id='color_tags_"+id+"' style='padding:5px;'><h5>Colors: </h5>"+colors+"</div><button type='button' class='btn btn-primary updateBtn' id='ubtn_"+id+"'>Update</button><button type='button' class='btn btn-danger deleteBtn' id='dbtn_"+id+"'>Delete</button><button type='button' class='btn btn-secondary selectBtn' id='sbtn_"+id+"'>+</button></div></div>");
    // $("#display_row").append("<div class='card_"+col+"' id='card_"+id+"'style='width: 18rem;'></div>");
    // $("#card_"+id).append("<img class='card-img-top' src='"+media+"' alt='Card image cap'>");
    // $("#card_"+id).append("<div class='card-body' id='card_body_"+id+"'><h5 class='card-title' id='card_title_"+id+"'>"+title+"</h5></div>")
    // $("#card_body_"+id).append("<p class='card-text'>"+source+"</p>")
    // $("#card_body_"+id).append("<button type='button' class='btn btn-primary updateBtn' id='ubtn_"+id+"'>Update</button>")
    // $("#card_body_"+id).append("<button type='button' class='btn btn-danger deleteBtn' id='dbtn_"+id+"'>Delete</button>")
}

//Reading Data
var getDataFromServer = function() {
    $.ajax({
        type: "GET",
        url: "list",
        // data: {title: "string", source: "link", media: "link"},
        dataType: "json",
        success: function(result) { //takes python result
            arr_items = Object.keys(result).length;
            for (let i = 0; i < arr_items; i++) {
                sub_items = result[i].length
                for (let j = 0; j < sub_items; j++) {
                    id = result[i][j][0];
                    title = result[i][j][1]['title']
                    source = result[i][j][1]['source']
                    media = result[i][j][1]['media']
                    col = result[i][j][1]['col']
                    colors = result[i][j][1]['colors']
                    formCard(id, title, source, media, col, colors);
                }
            }
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

//Updating Data
var updateData = function(id, submission) {
    new_content = {'id': id, 'colors': submission}
    $.ajax({
        type: "POST",
        url: "update",
        datatype: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(new_content),
        success: function(result) { //takes python result
            replaceData(id, submission);
        },
        error: function(request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

var replaceData = function(id, content) {
    $("#input_title_" + id).replaceWith("<div id='color_tags_"+id+"' style='padding:5px;'><h5>Colors: </h5>"+content+"</div>");
}

//Deleting Data
var deleteData = function(id) {
    $.ajax({
        type: "GET",
        url: "delete",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: {'id': id},
        success: function(result) { //takes python result
            $("#card_"+id).remove();
        },
        error: function(request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

//Creating a new Project
var createNewProject = function(new_proj) {
    //dat = {"0": Array.from(new_proj)[0], "1": Array.from(new_proj)[1], "2": Array.from(new_proj)[2]}
    // $.ajax({
    //     type: "GET",
    //     url: "project_page",
    //     dataType: "",
    //     contentType: "application/json;charset=utf-8",
    //     data: dat,
    //     success: function(result) { //takes python result
    //         // console.log(result)
    //     },
    //     error: function(request, status, error) {
    //         console.log("Error");
    //         console.log(request)
    //         console.log(status)
    //         console.log(error)
    //     }
    // })
}

var searchBookmarks = function(term) {
    search_term = {'term': term}
    $.ajax({
        type: "GET",
        url: "search",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        data: search_term,
        success: function(result) { //takes python result
            arr_items = Object.keys(result).length;
            for (let i = 0; i < arr_items; i++) {
                console.log(result[i][0])
                id = result[i][0];
                title = result[i][1]['title']
                source = result[i][1]['source']
                media = result[i][1]['media']
                col = result[i][1]['col']
                formImgCard(id, title, source, media, col);
            }
        },
        error: function(request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

//Form image cards
var formImgCard = function(id, title, source, media, col) {
    console.log("163")
    title == "" ? title = 'source' : title = title
    $("#image_card_display_row").append("<div class='card "+col+"' id='card_"+id+"'style='width: 10rem;'><img class='card-img-top' src='"+media+"' alt='Card image cap'><div class='card-body'><h5 class='card-title' id='card_title_"+id+"'><a href='"+source+"'>"+title+"</a></h5></div></div>");
}

//DOM stuff
$(document).ready(function(){
    getDataFromServer();

    //Updating items
    $(document).on( "click", ".updateBtn", function() {
        id = this.id.substring(5);
        
        //Replace Tags with Input Form
        text = $("#color_tags_"+id).text().substring(8) //Capture the old color tags
        input_form = "<div class='col-md-12' style='padding-left:0px'><textarea id='input_title_"+id+"'>"+text+"</textarea></div>"
        $("#color_tags_" + id).html(input_form);
        $("#ubtn_"+id).removeClass(["updateBtn", "btn-primary"]).addClass( ["submitBtn", "btn-success"]).text("Submit")

        // Submit updated tags
        $(document).on( "click", ".submitBtn", function() {
            id = this.id.substring(5)
            new_sub = $("#input_title_"+id).val()
            updateData(id, new_sub)
            $("#ubtn_"+id).removeClass(["submitBtn", "btn-success"]).addClass(["updateBtn", "btn-primary"]).text("Update")
        })
    });

    //Delete Documents
    $(document).on("click", ".deleteBtn", function() {
        id = this.id.substring(5)
        deleteData(id)
    })
    
    //Create Projects
    const new_proj = new Set()
    $(document).on("click", ".selectBtn", function() {
        id = this.id.substring(5)
        //Add card id to array of card id's for new project
        new_proj.add(id)

        //Delete grey button and add successfully added message
        $("#sbtn_"+id).replaceWith("<h5 style='color: green'>Successfully added!</h5>")
        
        $(document).on("click", "#new_proj_button", function() {
            createNewProject(new_proj);
        })
    })

    //Search for Documents by Tag
    $(document).on("click", "#searchBtn", function() {
        term = $("#form1").val();
        $("#image_card_display_row").empty()
        searchBookmarks(term);
    })

    // console.log("133")
    // $(".cbox").each(function() {
    //     if ($(this).is(":checked")){
    //         console.log("135")
    //     }
    // })
})
