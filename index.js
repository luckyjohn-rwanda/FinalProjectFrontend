
var selectedRecord = null;
var selectedRecordID = null;
var baseUrl = "https://watercobackend.herokuapp.com";

// Get cookie
function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            console.log('cookie:'+ decodeURIComponent(cookiePair[1]))
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}


// User Login
function userLogin(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/users/signin",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            var data = response.user;
            console.log(data);
            console.log("token:" + response.token);
            document.cookie =  'authToken=' + response.token;
            alert("Logged on. Welcome");
            window.location.href = "./index.html";
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            Authorization: getCookie('authToken')
        }
       
        
    });
}

function onLoginDetailsSubmit() {
    var formData = {};
    formData["email"] = document.getElementById("email").value;
    formData["password"] = document.getElementById("password").value;
    
    userLogin(formData);
}

// User sign-Up (Create User)
function addUserRecordToTable(data) {
    var allus = document.getElementById("allus").getElementsByTagName("tbody")[0];
    var newRecord =allus.insertRow(allus.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.billerid;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.name;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.email;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = '<a onclick="onUserEdit(this)">Edit</a> <a onClick="onUserDelete(this)">Delete</a>';   
}

function addUser(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/users/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            var data = response.data;
            console.log(data);
            alert("Success");
            window.location.href = "./login.html";
            addUserRecordToTable(data);
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            Authorization: getCookie('authToken')
        }
       
        
    });
}

function onUserDetailsSubmit() {
  console.log("Function called : add user");
    var formData = {};
    formData["email"] = document.getElementById("email").value;
    formData["name"] = document.getElementById("name").value;
    formData["password"] = document.getElementById("password").value;
    
    if (selectedRecord == null) {
        addUser(formData);
    } else {
        updateUserRecord(formData);
    }
    clearUserForm();

}

function onUserDetailsSubmitTwo() {
    var formData = {};
    formData["email"] = document.getElementById("email").value;
    formData["name"] = document.getElementById("name").value;
    formData["password"] = document.getElementById("password").value;
    addUser(formData);
    clearUserForm();

}

// Get all users
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/users/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((user) => {
                addUserRecordToTable(user);
            });
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });
});

// View one User
function onUserIdSubmit() {
    var pid = document.getElementById("billerid").value;
    viewOneUser(pid);

}

function viewOneUser(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/users/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#allus tbody tr").remove();
            var data = response.data;
            data.forEach((user) => {
                addUserRecordToTable(user);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// Updating a user
function onUserEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("email").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("name").value = selectedRecord.cells[2].innerHTML;
   
}

function updateUserTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.email;
    selectedRecord.cells[2].innerHTML = data.name;
    }


function updateUserRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/users/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            alert("Success");
            updateUserTableRecord(data);
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function onUserDelete(td) {
    if (confirm('Are you sure you want to delete this record')) {
        var row = td.parentElement.parentElement;
        deleteUserData(row);
        
        
    }

}

function deleteUserData(row){
    $.ajax({
        type: "DELETE",
        url: baseUrl + "/users/" + row.cells[0].innerHTML,
        cache: false,
        success: function (response) {
            alert("Success");
            console.log(response.message);
            console.log(selectedRecordID);
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearUserForm() {
    document.getElementById("email").value = "";
    document.getElementById("name").value = "";
    
}

// Add member
function addMemberRecordToTable(data) {
    var memberslist = document.getElementById("memberslist").getElementsByTagName("tbody")[0];
    var newRecord =memberslist.insertRow(memberslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.memberid;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.name;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.phone;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.email;
    var cell5 = newRecord.insertCell(4);
    cell5.innerHTML = '<a onclick="onMemberEdit(this)">Edit</a> <a onClick="onMemberDelete(this)">Delete</a>';   
}

 
function onMemberFormSubmit() {
  console.log("Add member called");
    var formData = {};
    formData["name"] = document.getElementById("name").value;
    formData["phone"] = document.getElementById("phone").value;
    formData["email"] = document.getElementById("email").value;
    

    if (selectedRecord == null) {
        saveMemberFormData(formData);
    } else {
        updateMemberFormRecord(formData);
    }
    clearMemberForm();
}

function onBillFormSubmit() {
    var formData = {};
    formData["premiseid"] = document.getElementById("premiseid").value;
    formData["billerid"] = document.getElementById("billerid").value;
    formData["reading"] = document.getElementById("reading").value;

    saveBillFormData(formData);

    clearBillForm();
}

function onPayFormSubmit() {
    var formData = {};
    formData["billid"] = document.getElementById("billid").value;
    formData["paid"] = document.getElementById("paid").value;

    savePayFormData(formData);

    clearPayForm();
}

// Adding a member
function saveBillFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/bills/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            alert("Success");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });
}

// Adding a member
function savePayFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/payments/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            console.log("Paid");
            alert("Success");
            close();
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });
}

// Adding a member
function saveMemberFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/members/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            console.log(response.token);
            addMemberRecordToTable(response.data);
            alert("Success");
           
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
       
        
    });
}


// Getting all members
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/members/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((member) => {
                addMemberRecordToTable(member);
            });
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });
});

// View one Member
function onMemberIdSubmit() {
    var pid = document.getElementById("memberid").value;
    viewOneMember(pid);

}

function viewOneMember(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/members/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#memberslist tbody tr").remove();
            var data = response.data;
            data.forEach((Member) => {
                addMemberRecordToTable(Member);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

//Updating a member
function onMemberEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("name").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("phone").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("email").value = selectedRecord.cells[3].innerHTML;
   
}

function updateMemberTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.name;
    selectedRecord.cells[2].innerHTML = data.phone;
    selectedRecord.cells[3].innerHTML = data.email;
    }


function updateMemberFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/members/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updateMemberTableRecord(data);
            alert("Success");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// Deleting a member
function onMemberDelete(td) {
    if (confirm('Are you sure you want to delete this record')) {
        var row = td.parentElement.parentElement;
        deleteMemberData(row);
        document.getElementById("memberslist").deleteRow(row.rowIndex);
    }

}

function deleteMemberData(row){
    $.ajax({
        type: "DELETE",
        url: baseUrl + "/members/" + row.cells[0].innerHTML,
        cache: false,
        success: function (response) {
            alert("Success");
            console.log(response.message);
            console.log(selectedRecordID);
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearMemberForm() {
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    
}

function clearBillForm() {
    document.getElementById("premiseid").value = "";
    document.getElementById("billerid").value = "";
    document.getElementById("reading").value = "";
}

function clearPayForm() {
    document.getElementById("billid").value = "";
    document.getElementById("paid").value = "";
}


// Add Premise
function addPremiseRecordToTable(data) {
    var Premiseslist = document.getElementById("Premiseslist").getElementsByTagName("tbody")[0];
    var newRecord =Premiseslist.insertRow(Premiseslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.premiseid;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.meterno;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.memberid;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.routeid;
    var cell5 = newRecord.insertCell(4);
    cell5.innerHTML = '<a onclick="onPremiseEdit(this)">Edit</a>';   
}
 
function onPremiseFormSubmit() {
    var formData = {};
    formData["meterno"] = document.getElementById("meterno").value;
    formData["memberid"] = document.getElementById("memberid").value;
    formData["routeid"] = document.getElementById("routeid").value;
    

    if (selectedRecord == null) {
        savePremiseFormData(formData);
    } else {
        updatePremiseFormRecord(formData);
    }
    clearPremiseForm();
}

// Adding a Premise
function savePremiseFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/premises/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            addPremiseRecordToTable(response.data);
            alert("Success");
            
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
       
        
    });
}


// Getting all Premises
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });


});

// Getting all premises by a member
function onMemberIdInput() {
    var pid = document.getElementById("memberid").value;
    sortByMember(pid);

}

function sortByMember(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/member/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#Premiseslist tbody tr").remove();
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// Getting all premises by route
function onRouteIdInput() {
    var pid = document.getElementById("memberid").value;
    sortByRoute(pid);

}

function sortByRoute(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/route/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#Premiseslist tbody tr").remove();
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// View one Premise
function onPremiseIdInput() {
    var pid = document.getElementById("memberid").value;
    viewOnePremise(pid);

}

function viewOnePremise(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#Premiseslist tbody tr").remove();
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

//Updating a Premise
function onPremiseEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("meterno").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("memberid").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("routeid").value = selectedRecord.cells[3].innerHTML;
   
}

function updatePremiseTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.meterno;
    selectedRecord.cells[2].innerHTML = data.memberid;
    selectedRecord.cells[3].innerHTML = data.routeid;
    }


function updatePremiseFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/premises/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updatePremiseTableRecord(data);
            alert("Success");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearPremiseForm() {
    document.getElementById("meterno").value = "";
    document.getElementById("memberid").value = "";
    document.getElementById("routeid").value = "";
    
}

// Add Route
function addRouteRecordToTable(data) {
    var Routeslist = document.getElementById("Routeslist").getElementsByTagName("tbody")[0];
    var newRecord =Routeslist.insertRow(Routeslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.routeid;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.name;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = '<a onclick="onRouteEdit(this)">Edit</a>';   
}
 
function onRouteFormSubmit() {
    var formData = {};
    formData["name"] = document.getElementById("name").value;

    if (selectedRecord == null) {
        saveRouteFormData(formData);
    } else {
        updateRouteFormRecord(formData);
    }
    clearRouteForm();
}

// Adding a Route
function saveRouteFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/routes/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            addRouteRecordToTable(response.data);
            alert("Success");
            
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
       
        
    });
}


// Getting all Routes
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/routes/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((Route) => {
                addRouteRecordToTable(Route);
            });
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });
});


//Updating a Route
function onRouteEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("name").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("submit").value = "Update Route";
   
}

function updateRouteTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.name;
    }


function updateRouteFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/routes/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updateRouteTableRecord(data);
            alert("Success");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearRouteForm() {
    document.getElementById("name").value = "";
    
}

// get all payments
$(document).ready(() => {
$.ajax({
    url: baseUrl + "/payments", 
    method: 'GET',
    dataType : 'json',
    success: function(data){
      if(data.data.length > 0){
        console.log("Fetched payments");
          for(let index = 0; index < data.data.length; index++) {
            var newRow = $("<tr>");
            var cols = "";
            var payid = '';
            var billid = '';
            var paid = '';
            var createdAt = '';
            var newpaid = numberWithCommas(data.data[index].paid);
            cols += '<td> '+ data.data[index].payid +'</td>';
            cols += '<td> '+ data.data[index].billid +'</td>';
            cols += '<td> '+ newpaid+'</td>';
            newRow.append(cols);
            $("#allpa .tbody").append(newRow);
          }
    }
  }
})
})
//View Payment by Premise
function onPrIdInput() {
    var pid = document.getElementById("payid").value;
    sortbyPremise(pid);

}

function sortbyPremise(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/payments/premise/" + id,
        cache: false,
        success: function (data) {
            console.log(id);
            $("#allpa tbody tr").remove();
            if(data.data.length > 0){
                console.log("Fetched payments");
                  for(let index = 0; index < data.data.length; index++) {
                    var newRow = $("<tr>");
                    var cols = "";
                    var payid = '';
                    var billid = '';
                    var paid = '';
                    var createdAt = '';
                    var newpaid = numberWithCommas(data.data[index].paid);
                    cols += '<td> '+ data.data[index].payid +'</td>';
                    cols += '<td> '+ data.data[index].billid +'</td>';
                    cols += '<td> '+ newpaid+'</td>';
                    newRow.append(cols);
                    $("#allpa .tbody").append(newRow);
                  }
            }
            
            
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// Get all bills
$(document).ready(() => {
    $.ajax({
        url: baseUrl + "/bills/", 
        method: 'GET',
        dataType : 'json',
        success: function(data){
          if(data.data.length > 0){
            console.log("Fetched bills");
              for(let index = 0; index < data.data.length; index++) {
                var newRow = $("<tr>");
                var cols = "";
                var billid = '';
                var premiseid = '';
                var billerid = '';
                var reading = '';
                var amount = '';
                var newAmount = numberWithCommas(data.data[index].amount);
                cols += '<td> '+ data.data[index].billid +'</td>';
                cols += '<td> '+ data.data[index].premiseid +'</td>';
                cols += '<td> '+ data.data[index].billerid+'</td>';
                cols += '<td> '+ data.data[index].reading+'</td>';
                cols += '<td> '+ newAmount+'</td>';
                newRow.append(cols);
                $("#allbi .tbody").append(newRow);
              }
        }
      }
    })
    })

// Capture a Bill
$(document).ready(() => {
$.ajax({
    url: baseUrl + "/premises", 
    method: 'GET',
    dataType : 'json',
    success: function(data){
      if(data.data.length > 0){
        console.log("Fetched premises IDs");
          for(let index = 0; index < data.data.length; index++) {
            $('#PremiseID').append('<option name="premiseid" value="' + data.data[index].premiseid + '">' + data.data[index].premiseid + '</option>');
          }
    }
  }
})
})

// biller IDs for select - bills
$(document).ready(() => {
$.ajax({
    url: baseUrl + "/users", 
    method: 'GET',
    dataType : 'json',
    success: function(data){
      if(data.data.length > 0){
        console.log("Fetched biller IDs");
          for(let index = 0; index < data.data.length; index++) {
            $('#UserID').append('<option value="' + data.data[index].billerid + '">' + data.data[index].billerid + '</option>');
          }
    }
  }
})
})

// thousand separator
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

//View a bill
function onBillIdInput() {
    var pid = document.getElementById("Billid").value;
    viewOneBill(pid);

}

function viewOneBill(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/bills/" + id,
        cache: false,
        success: function (data) {
            $("#allbi tbody tr").remove();
            if(data.data.length > 0){
                console.log("Fetched bills");
                  for(let index = 0; index < data.data.length; index++) {
                    var newRow = $("<tr>");
                    var cols = "";
                    var billid = '';
                    var premiseid = '';
                    var billerid = '';
                    var reading = '';
                    var amount = '';
                    var createdAt = '';
                    var newAmount = numberWithCommas(data.data[index].amount);
                    cols += '<td> '+ data.data[index].billid +'</td>';
                    cols += '<td> '+ data.data[index].premiseid +'</td>';
                    cols += '<td> '+ data.data[index].billerid+'</td>';
                    cols += '<td> '+ data.data[index].reading+'</td>';
                    cols += '<td> '+ newAmount+'</td>';
                    newRow.append(cols);
                    $("#allbi .tbody").append(newRow);
                  }
            }
            
            
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

