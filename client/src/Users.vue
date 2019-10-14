<template>
  <div>
    <div v-if="errorFlag" style="color: red">
      {{ error }}
    </div>

    <form style="border-bottom-style: ridge">
      <div class="container" style="margin-bottom: 400px">
        <div class="row">
          <div class="col-sm-6 col-md-4 col-md-offset-4">
            <h1 class="text-center login-title"><span class="glyphicon glyphicon-user"></span> {{this.username}}</h1>
            <div class="account-wall">
              <form class="form-signin">
                <form class="form-group">
                  <label><span class="glyphicon glyphicon-user"></span> {{ "Given Name: " + this.fname}}</label>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-user"></span> {{"Family Name: " + this.lname}}</label>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-envelope"></span> {{"Email: " + this.email}}</label>
                </form>


                <form class="form-group">
                  <label> {{"Account Balance: $" + this.accountBal}}</label>
                </form>


                <button type="button" data-toggle="modal" data-target="#editModal">Edit Profile</button>
              </form>

              <div class="modal fade" id="editModal" role="dialog">
                <div class="modal-dialog">

                  <!-- Modal content-->
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Filter By</h4>
                    </div>
                    <div class="modal-body">
                      <table>

                        <tr>
                          <td style="text-align: left">Username: </td>
                          <td style="padding-left: 5px">
                            <input v-model="edit.username" id="usernameInput"  type="text" placeholder="..">
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align: left">Given Name: </td>
                          <td style="padding-left: 5px">
                            <input v-model="edit.fname" id="fnameInput"  type="text" placeholder="..">
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align: left">Family Name: </td>
                          <td style="padding-left: 5px">
                            <input v-model="edit.lname" id="lnameInput"  type="text" placeholder="..">
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align: left">Email: </td>
                          <td style="padding-left: 5px">
                            <input v-model="edit.email" id="emailInput"  type="text" placeholder="..">
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align: left">Password: </td>
                          <td style="padding-left: 5px">
                            <input v-model="edit.password" id="passwordInput"  type="password" placeholder="">
                          </td>
                        </tr>


                      </table>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal" id="searchSumbit" v-on:click="editUser()">Submit</button>
                      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </form>


  </div>

</template>

<script>
    export default {
        data: function(){
          return{
            error: "",
            errorFlag: false,
            username: "",
            fname: "",
            lname: "",
            email: "",
            accountBal: 0,
            edit: {
              username: "",
              fname: "",
              lname: "",
              email: "",
              password: "",
            }

          }
        },
      mounted: function(){
         this.getPersonalUser();
      },
      methods: {
          getPersonalUser: function(){
            alert(this.$cookies.get("user_session"));
            this.$http.get('http://localhost:4941/api/v1/users/' + this.$cookies.get("user_id"), {

              headers: {'X-Authorization': this.$cookies.get("user_session")}

            })
             
              .then(function(response){
                var data = response.body
                this.username = data.username;
                this.fname = data.givenName;
                this.lname = data.familyName;
                this.email = data.email;
                this.accountBal = data.accountBalance;
              }, function(error){
                this.error = error;
                this.errorFlag = true;
              })
          },

        editUser: function(){
            var id = this.$cookies.get("user_id");
            var toEdit = '{';

            if(this.edit.username != "") {
              toEdit += '"username"' + ":" + '"' + this.edit.username + '", ';
            }

            if(this.edit.fname != ""){
              toEdit += '"givenName"' + ":" + '"' + this.edit.fname + '", ';
            }

            if(this.edit.lname != ""){
              toEdit += '"familyName"' + ":" + '"' + this.edit.lname + '", ';
            }

            if(this.edit.email != ""){
              toEdit += '"email"' + ":" + '"' + this.edit.email + '", ';
            }

            if(this.edit.password != ""){
              toEdit += '"password"' + ":" + '"' + this.edit.password + '", ';
            }

         
            toEdit = toEdit.slice(0, -2);
            toEdit += '}';
          
            var req = JSON.parse(toEdit);

            alert(toEdit);

          this.$http.patch('http://localhost:4941/api/v1/users/' + id, toEdit
          , {headers: {'X-Authorization': this.$cookies.get("user_session")}})
          .then(function(response){
            if(response.status == 201){
              this.$router.push('/user/' + id);
              this.$router.go(this.$router.currentRoute);
              alert("Profile changed");
            } else{
              alert("something went wrong");
            }

          }, function(error){
            this.error = error;
            this.errorFlag = true;
          })

        }
      }
    }
</script>

<style scoped>

</style>
