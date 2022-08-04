var testApp = angular.module("myMitan", []);

testApp.controller("mitaan_connect", function ($scope, $http) {
  $scope.home = "This is the homepage";
  const params = new URLSearchParams(window.location.search).get("id");
  const id = params?.split("/")[0];
  if (!id) {
    window.location.replace("#");
  }
  $http.get("https://web-api.cgmitaan.in/applications/trigger-call/" + id).then(
    function successCallback(response) {
      setTimeout(() => {
        window.location.replace("#");
      }, 4000);
    },
    function errorCallback(response) {
      document.getElementById("mainText").innerHTML = "Failed to connect..";
      document.getElementById("subText").innerHTML =
        response.data.message || "Something went wrong";
      document.getElementById("loader").style.display = "none";
    }
  );
});
