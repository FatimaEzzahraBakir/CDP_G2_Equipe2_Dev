
document.getElementById("newIssueButton").addEventListener("click", function () {
  $("#newIssueRow").ready(function () {

    let raw_ejs = $.ajax({
      url: "/partials/newIssueRow.ejs",
      async: false
    }).responseText;
    let element = ejs.render(raw_ejs, { sprints: sprints });
    $("#newIssueRow").append(element);

    $("#dismissNewIssue").click(function () {
      $("#newIssueRow").empty();
      $("#newIssueButton").show();
    });

    $("#submitNewIssue").on('click', function () {
      $.ajax({
        url: '/user/'+ userLogin + '/projects/' + projectID + '/addIssue',
        type: "POST",
        dataType: "json",
        data: {
          num: $('#idfield').val(),
          description: $('#descfield').val(),
          priority: $('#priofield').val(),
          difficulty: $('#difffield').val(),
          state: $('#statefield').val(),
          release: $('#sprintfield').val()
        },
        error: function () {
          $("#newIssueRow").empty();
          $("#newIssueButton").show();
        },
        success: function () {
          window.location.reload();
        }
      });
    });
    $("#newIssueButton").hide();
  });
});