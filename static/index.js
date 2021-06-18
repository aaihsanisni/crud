// const { json } = require("body-parser");

var app = angular.module("mainApp",[]);
app.controller("CRUDController", function($scope){
    console.log("CRUDController called");
    // $scope.EmpList=[]; // empty array of Employees

    $scope.GetData = function(){

        fetch("/employees", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log("received data from server get", data);
            return data;
        }).then(data => {
            $scope.EmpList = data.empList;
            //To update data in angular inside a third party promise
            $scope.$apply();
            // a.concat(b)
            console.log("$scope.EmpList", $scope.EmpList.length);
        }).catch(error => console.log('ERROR'))
    };
    
    $scope.AddData = async function(){ //add data to the table
        var emp = {
            employeecode: $scope.employeecode,
            employeename: $scope.employeename,
            employeeemail: $scope.employeeemail,
            isactive: ($scope.isactive & 1)
        };
        //console.log("isactive!!!!!!!!!!!!!!!", (emp.isactive & 1) )

        
        fetch('/employees', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(emp)
        }).then(res => {
            return res.json()
        }).then(data =>  {
            console.log("aaaaaaaaaaaa",data)
            emp.id = data.id;
            console.log("emp!!!!!!!!!!!!!!", emp);
            return emp;
        }).then(emp => {
            $scope.EmpList.push(emp);
            $scope.$apply();
        })
        .catch(error => console.log('ERROR'))
        //ClearModel();
        
    };


    $scope.DeleteData = function(emp){
        var index = $scope.EmpList.indexOf(emp);
        $scope.EmpList.splice(index,1);
        fetch("/employees/"+emp.id, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).then(data => console.log(data))
        .catch(error => console.log("ERROR"))
    };

    // $scope.getId = function(emp){
    //     fetch("/employees", {
    //         method: "GET",
    //         headers: {
    //             "content-type": "application/json"
    //         },
    //     }).then(res => {
    //         return res.json()
    //     }).then(data => {
    //         console.log("received data from server get", data);
    //         return data;
    //     }).then(data => {
    //         $scope.EmpList = data.empList;
    //         //To update data in angular inside a third party promise
    //         $scope.$apply();
    //         // a.concat(b)
    //         console.log("$scope.EmpList", $scope.EmpList.length);
    //     }).catch(error => console.log('ERROR'))
    // }

    $scope.BindSelectedData = function(emp){
        $scope.id = emp.id;
        console.log("!D!!!!!!!!!!!!!!!!!!!", emp.id);
        $scope.employeecode = emp.employeecode;
        $scope.employeename = emp.employeename;
        $scope.employeeemail = emp.employeeemail;
        $scope.isactive = emp.isactive;
    };

    $scope.UpdateData = function(){
        var id = 0;
        var emp = {}
        $.grep($scope.EmpList, function(e){
            if(e.id == $scope.id){
                id = e.id;
                e.employeename = $scope.employeename;
                e.employeecode = $scope.employeecode;
                e.employeeemail = $scope.employeeemail;
                e.isactive = $scope.isactive;
                emp = e;
            }
        });
        console.log("id", id);
        fetch("/employees/"+id, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(emp)
        }).then(res => {
            return res.json()
        }).then(data => console.log(data))
        .catch(error => console.log("ERROR"))
    };

    $scope.LogOut = function(){
        fetch("/logout", {
            method: "GET", 
            redirect: 'follow'
        }).then(response => {
                // HTTP 301 response
        }).catch(function(error) {
            console.info(error);
        });
        
    };

    

    function ClearModel(){
        $scope.id = 0;
        $scope.employeecode = 0;
        $scope.employeename = '';
        $scope.employeeemail = '';
        $scope.IsAcvtive = null;
    }
});