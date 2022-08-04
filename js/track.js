var testApp = angular.module("myMitan", []);

testApp.controller("mitan_mainCtrl", function ($scope, $http) {
  $scope.home = "This is the homepage";
  let loader = null;
  $scope.submit = function () {
    //Loading start
    document.getElementById("loader").style.display = "block";
    // https://mitaan.ipq.co:3000/tickets/1029-22-100-000007
    //.get("https://mitaan-be.ipq.co:3000/ticket/" + $scope.track.ARNnumber)

    $http.get("https://web-api.cgmitaan.in/tickets/" + $scope.track.ARNnumber).then(
      function successCallback(response) {
        $scope.response = response;

        if ($scope.response.status == 200) {
          // Loading END
          document.getElementById("loader").style.display = "none";
          $scope.track = response.data.data;
          $scope.track.fullName = $scope.track.application.citizen.firstName
            ? $scope.track.application.citizen.firstName +
              " " +
              $scope.track.application.citizen.lastName
            : "";
          //ARN
          if($scope.track.application.ticketNumber != undefined)
          document.getElementById("ticketNumber").innerHTML =
            $scope.track.application.ticketNumber;
          //Citizen Name
          if($scope.track.application.fullName != undefined)
          document.getElementById("citizenName").innerHTML =
            $scope.track.fullName;
          //Status
          if($scope.track.application.status != undefined)
          document.getElementById("status").innerHTML =
            $scope.track.application.status;
          //LastUpdateDate
          if($scope.track.application.updatedAt != undefined)
            document.getElementById("datetime").innerHTML = convertDateTime(
              $scope.track.application.updatedAt
            );
          //Message
          if($scope.track.application.message != undefined)
          document.getElementById("message").innerHTML = response.data.message;

          //Status
          var status = $scope.track.application.status;
          var cstatus = -1;
          var cls = document.getElementsByClassName("step");

          if (
            [
              "DOCUMENTS_UNAVAILABLE_PENDING_REQUEST",
              "SLOT_UNAVAILABLE_PENDING_REQUEST",
            ].some((a) => a === status)
          )
            cstatus = 0;
          else if (
            [
              "AWAITING_FIELD_AGENT_ALLOCATION",
              "PENDING_FIELD_AGENT_VISIT",
              "IN_PROGRESS_FIELD_AGENT_VISIT",
              "ON_HOLD_FIELD_AGENT_VISIT",
              "INCOMPLETE_FIELD_AGENT_VISIT",
              "RESCHEDULE_REQUEST_FIELD_AGENT_VISIT",
            ].some((a) => a === status)
          )
            cstatus = 1;
          else if (
            ["COMPLETE_FIELD_AGENT_VISIT", "IN_PROGRESS_GOV_PROCESS"].some(
              (a) => a === status
            )
          )
            cstatus = 2;
          else if (
            ["OUT_FOR_DELIVERY", "CITIZEN_UNAVAILABLE_FOR_DELIVERY"].some(
              (a) => a === status
            )
          )
            cstatus = 3;
          else if (status === "COMPLETED") cstatus = 4;

          var clsCom = document.getElementsByClassName("step completed"); // clearing old track status
          for (let i = clsCom.length - 1; i >= 0; i--)
            clsCom[i].className = "step";

          if (cstatus != -1)
            for (let i = 0; i <= cstatus; i++)
              cls[i].className = "step completed"; // writing new track status
        } else {
          document.getElementById("loader").style.display = "none";
        }
      },
      function errorCallback(response) {
        document.getElementById("ticketNumber").innerHTML = "NA";
        document.getElementById("citizenName").innerHTML = "NA";
        document.getElementById("status").innerHTML = "NA";
        document.getElementById("datetime").innerHTML = "NA";
        document.getElementById("message").innerHTML = response.data.message;
        document.getElementById("loader").style.display = "none";
        var cls = document.getElementsByClassName("step completed");
        for (let i = cls.length - 1; i >= 0; i--) cls[i].className = "step";
      }
    );
  };
  function convertDateTime(dt) {
    var b = dt.split("-");
    var time = b[2].split("T")[1].split(":");
    return `${b[2].split("T")[0]}-${b[1]}-${b[0]} ${time[0]}:${time[1]}`;
  }
});
