//const { Month, Week } = require('../static/js/calendar.js');

let today = new Date();
let currMonth = new Month(today.getFullYear(), today.getMonth());

let logIn = false;
let userId = '';
let username = '';
let csrfToken;

$(document).ready(function () {
    updateUserViews();
    generateCalendar();
    updateCalendar();
    //showCalendar();
    $("#loginForm").hide();
    $("#SignupForm").hide();
    $("#createEventForm").hide();
    $("#editEventForm").hide();
    

$("#showLoginBtn").click(function (event) {
    showLoginForm();
});

$("#showSignupBtn").click(function (event) {
    showSignupForm();
});

$("#logoutBtn").click(function (event) {
    
    logout();
});

$("#loginBtn").click(function (event) {
    event.preventDefault();
    login();
});

$("#signupBtn").click(function (event) {
    event.preventDefault();
    signup();
});

$("#showCreateEventBtn").click(function (event) {
    showCreateEventForm();
});

$("#createEventBtn").click(function (event) {
    event.preventDefault();
    createEvent();
});

$("#editEventBtn").click(function (event) {
    event.preventDefault();
    updateEvent();
});

$("#nextmonthBtn").click(function (event) {
    currMonth = currMonth.nextMonth();
    generateCalendar();
    updateCalendar();
});

$("#prevmonthBtn").click(function (event) {
    currMonth = currMonth.prevMonth();
    generateCalendar();
    updateCalendar();

});

});

function updateCalendar(){

    if(logIn){

        generateEvents(userId);
    }

}

function generateCalendar() {
    $("#showCalendar").empty();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $("#currMonth").text(months[currMonth.month]);
    $("#currYear").text(currMonth.year);
    let weeks = currMonth.getWeeks();
    header =  $(' <div class="grid" id="cal_head"><div class="head_grid"><span class="head_day">SUN</span></div>'+
    '<div class="head_grid"><span class="head_day">MON</span></div>'+
    '<div class="head_grid"><span class="head_day">TUE</span></div>'+
    '<div class="head_grid"><span class="head_day">WED</span></div>'+
    '<div class="head_grid"><span class="head_day">THU</span></div>'+
    '<div class="head_grid"><span class="head_day">FRI</span></div>'+
    '<div class="head_grid"><span class="head_day">SAT</span></div></div>'+
    '<div class="grid" id="calendar-body"></div>');
    $("#showCalendar").append(header);
    let w;
    for (w in weeks) {
        if (weeks.hasOwnProperty(w)) {
        let days = weeks[w].getDates();

        let d;
        for (d in days) {
            if (days.hasOwnProperty(d)) {
            let $daysDiv = $('<div class="day_grid"></div>');
            let $daySpan = $('<span class="day"></span>');

            let day = days[d];
            let dayLabel = day.getDate();
            

            if (day.getMonth() != currMonth.month) {
                $daySpan.css("color", "gray");
            } else if (day.getDate() == today.getDate() && day.getMonth() == today.getMonth() &&
                day.getFullYear() == today.getFullYear()) {
                $daysDiv.css({
                    "background": "yellow",
                    "border": "1px solid black"
                });
                $daySpan.css({
                    "font-weight": "bold",
                    "color": "green"
                });
            }

            let date = formatDay(day);
            $daysDiv.addClass(date);

            $("#calendar-body").append(
                $daysDiv.append(
                    $daySpan.append(dayLabel)
                )
            );
        }
        }
    }
    }
}

function updateUserViews() {
    if (logIn) {
        console.log("login");
        $("#showCreateEventBtn").show();
        $("#showLoginBtn").hide();
        $("#showSignupBtn").hide();       
        $("#logoutBtn").show();

    } else {
        console.log("not login");
        $("#showCreateEventBtn").hide();
        $("#showLoginBtn").show();
        $("#showSignupBtn").show();       
        $("#logoutBtn").hide();
    }
}

function showCalendar() {
    $("#calendar").show();
    $("#calendarPanel").show();
    $("#loginForm").hide();
    $("#SignupForm").hide();
    $("#createEventForm").hide();
    $("#editEventForm").hide();
}

function showLoginForm() {
    $("#calendar").hide();
    $("#calendarPanel").hide();
    $("#loginForm").show();
    $("#SignupForm").hide();
    $("#createEventForm").hide();
    $("#editEventForm").hide();

}

function showSignupForm() {
    $("#calendar").hide();
    $("#calendarPanel").hide();
    $("#loginForm").hide();
    $("#SignupForm").show();
    $("#createEventForm").hide();
    $("#editEventForm").hide();
}

function showCreateEventForm() {
    $("#calendar").hide();
    $("#calendarPanel").hide();
    $("#loginForm").hide();
    $("#SignupForm").hide();
    $("#createEventForm").show();
    $("#editEventForm").hide();

}

function showEditEventForm(eventId, title, date, startTime, endTime, type, user_id) {
    $("#calendar").hide();
    $("#calendarPanel").hide();
    $("#loginForm").hide();
    $("#SignupForm").hide();
    $("#createEventForm").hide();
    $("#editEventForm").show();
    $("#editEventTitle").val(title);
    $("#editEventDate").val(date);
    $("#editEtartTime").val(startTime);
    $("#editEndTime").val(endTime);
    $("#editEventType").val(type);
    $("#editEventId").val(eventId);
}


function signup() {
    let url = "/server/api/signUp";
    //let $form = $(".SignupForm");
    let signupdata =$.param({
        'username': $("#signupName").val(),
        'password': $("#signupPwd").val(),
        'token': csrfToken
    });

    $("#errorShow").empty();
    console.log("signup!");
    console.log(signupdata);
    $.post(url, signupdata, function (data, status) {
        //$("showLoginBtn").hide();
         console.log(data);
         alert("Hi");
         alert(data);
         if (data.success) {
             logIn = true;
             userId = data.user_id;
             username = data.username;
             csrfToken = data.token;
             showCalendar();
             updateUserViews();
             updateCalendar();
             console.log("Correct: " + data.message);
         } else {
             console.log("Error: " + data.message);
             $("#errorShow").text(data.message);
         }
     }, "json");
    
}

function login() {
    let url = "/server/api/login";
    let $form = $(".loginForm");
    
    let logindata = {
        "username": $("#loginName").val(),
        "password": $("#loginPwd").val()
    };
    alert($("#loginName").val());
    $("#errorShow").empty();
    console.log("login!");
    alert(csrfToken);
    
    $.post(url, JSON.stringify(logindata), function (data, status) {
       //$("showLoginBtn").hide();
        console.log(data);
        //alert("Hi");
        //alert(data);
        if (data.success) {
            logIn = true;
            userId = data.user_id;
            username = data.username;
            csrfToken = data.token;
            showCalendar();
            updateUserViews();
            updateCalendar();
            console.log("Correct: " + data.message);
        } else {
            console.log("Error: " + data.message);
            $("#errorShow").text(data.message);
        }
    }, "json");
    
}

function logout() {
    let url = "/server/api/logout";
    let outdata = $.param({
        'token': csrfToken
    });

    $("#errorShow").empty();

    $.post(url, outdata, function (data, status) {
        if (data.success) {
            logIn = false;
            userId = null;
            username = null;
            csrfToken = null;
            console.log("Log out succeeded!");
            updateUserViews();
            updateCalendar();
            showLoginForm();
        } else {
            console.log("Error: Could not log user out");
        }
    });
}

function createEvent() {
    let url = "/server/api/createEvent";
    //let $form = $(".createEventForm");
    
    let create_event_data = $.param({
        'title': $("#eventTitle").val(),
        'date': $("#eventDate").val(),
        'startTime': $("#startTime").val(),
        'endTime': $("#endTime").val(),
        'type': $("#eventType").val(),
        'token':csrfToken
       
    });
    $("#errorShow").empty();

    $.post(url, create_event_data, function (data, status) {
        if (data.success) {
            console.log("Creat event succeeded!");
            console.log("Title: " + data.title + ",  Date: " + data.date + ", start time: " + data.startTime + ", end time: " + data.endTime);
            showCalendar();
            updateCalendar();
            //generateEvents();

        } else {
            console.log("Error: Event could not be created");
            $("#errorShow").text(data.message);
        }
    });
}

function generateEvents(userId) {
    let url = "/server/api/generateEvents";
    let gdata = {
        'token': csrfToken
    };
    //alert(csrfToken);
    $("#errorShow").empty();
    $('.day_grid p').remove();

    $.post(url, gdata, function (data, success) {
        if (data.success) {
            console.log(data.message);
            let events = data.events;

            for (let i = 0; i < events.event_id_list.length; i++) {
                let eventId = events.event_id_list[i];
                let title = events.title_list[i];
                let date = events.date_list[i];
                let startTime = events.start_time_list[i];
                let endTime = events.end_time_list[i];
                let type = events.type_list[i];
                let user_id = events.user_id_list[i]; // don't use

                let $p = $('<p></p>');

                let $a = $('<a href="#">' + title + '</a>');

                $a.css("color", 'red');

                let typeClass = "type_" + type;
                $p.addClass(typeClass);
                $a.click(getEventsDetail(eventId, title, date, startTime, endTime, type, user_id));

                let selector = '.' + date;
                console.log(selector);
                $(selector).append(
                    $p.append($a)
                );
            }

            //showEventType();
        } else {
            console.log("Error: could not generate events");
        }
    });
}

function getEventsDetail(eventId, title, date, startTime, endTime, type, user_id){
    return function () {
        let $div = $("<div title='View Event'></div>");
        let $strong = $("<strong></strong>");
        let $p = $('<p></p>');
        $p.css('text-align', 'center');
        let $date = $('<p><strong>Date:</strong></p>');
        let $time = $('<p><strong>Time:</strong></p>');
        let $type = $('<p><strong>Type:</strong></p>');

        let timeString = startTime + ' - ' + endTime;
        $div.append(
            $p.append($strong.append(title))).append($date)
            .append(date)
            .append($('<br>'))
            .append($time)
            .append(timeString)
            .append('<br>')
            .append($type)
            .append(type)
            .append('<br>')
            .append($('<br>'));

        $div.dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            draggable: false,
            buttons: {
                "Delete": function () {
                    deleteEvent($div, eventId);
                },
                "Edit event": function () {
                    $(this).dialog("close");
                    let formattedStart = startTime.split(" ")[1].substring(0, startTime.split(" ")[1].length - 3);
                    let formattedEend = endTime.split(" ")[1].substring(0, endTime.split(" ")[1].length - 3);
                    showEditEventForm(eventId, title, date, formattedStart, formattedEend, type, user_id);
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    };
}

function updateEvent() {
    let url = "/server/api/updateEvent";
    //let $form = $(".editEventForm");
    let update_event_data = $.param({
        'event_id':$("#editEventId").val(),
        'title': $("#editEventTitle").val(),
        'date': $("#editEventDate").val(),
        'startTime': $("#editStartTime").val(),
        'endTime': $("#editEndTime").val(),
        'type': $("#editEventType").val(),
        'token':csrfToken
       
    });
    $("#errorShow").empty();

    $.post(url, update_event_data, function (data, status) {
        console.log(data);
        if (data.success) {
            console.log("Update event succeeded!");
            console.log("Title: " + data.title + ",  Date: " + data.create_date + ", start time: " + data.startTime + ", finish time: " + data.endTime + ", color: " + data.type);
            showCalendar();
            updateCalendar();
            //generateEvents();

        } else {
            console.log("Error: Event could not be updated");
            $("#errorShow").text(data.message);
        }
    });
}

function deleteEvent($div, eventId) {
    let url = "/server/api/deleteEvent";
    let params = {
        event_id: eventId,
        token: csrfToken
    };
    $.post(url, params, function (data, status) {
        if (data.success) {
            console.log("Delete event succeeded!");
            $div.dialog("close");
            updateCalendar();
            //generateEvents();

        } else {
            console.log("Error: Event could not be deleted");
        }
    });
}


function formatDay(day) {
    let y = day.getFullYear();
    let m = day.getMonth() + 1;
    let d = day.getDate();

    if (m.toString().length == 1) {
        m = '0' + m;
    }

    if (d.toString().length == 1) {
        d = '0' + d;
    }

    return y + '-' + m + '-' + d;
}
