<template>
  <div>
    <div v-if="errorFlag" style="color: red">
      {{ error }}
    </div>

    <form >
      <div class="container" style="margin-bottom: 400px">
        <div class="row">
          <div class="col-sm-6 col-md-4 col-md-offset-4">
            <h1 class="text-center login-title">New Auction</h1>
            <div class="account-wall">
              <form class="form-signin">
                <form class="form-group">
                  <label><span class="glyphicon glyphicon-pencil"></span> Title</label>
                  <input v-model="title" class="form-control" placeholder="Title" required autofocus>
                </form>

                <form class="form-group">
                  <label for="sel1"><span class="glyphicon glyphicon-list-alt"></span>Category</label>
                  <select v-model="categoryId" class="form-control" id="sel1">
                    <option>Apparel</option>
                    <option>Equipment</option>
                    <option>Vehicles</option>
                    <option>Property</option>
                    <option>Other</option>
                  </select>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-pencil"></span> Description</label>
                  <textarea v-model="description" class="form-control" rows="5" id="description"></textarea>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-calendar"></span> Start Date</label>
                  <input v-model="startDateTime" type="date"/>

                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-calendar"></span> End Date</label>
                  <input v-model="endDateTime" type="date"/>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-usd"></span> Reserve price</label>
                  <input v-model="reservePrice" class="form-control" type="number" placeholder="$" required>
                </form>

                <form class="form-group">
                  <label><span class="glyphicon glyphicon-usd"></span> Starting Bid</label>
                  <input v-model="startingBid" class="form-control" type="number" placeholder="$" required>
                </form>

                <button v-on:click="createAuction()" type="button" value="Add" class="btn btn-info btn-block">Create Auction</button>
              </form>
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
          startDateTime: 0,
          endDateTime: 0,
          title: "",
          categoryId: "",
          reservePrice: 0,
          startingBid: 0,
          description: ""
        }

      },

      methods: {

        createAuction: function(){

          var categoryId = 0;

          switch(this.categoryId){
            case 'Apparel':
              categoryId = 1;
              break;
            case 'Equipment':
              categoryId = 2;
              break;
            case 'Vehicles':
              categoryId = 3;
              break;
            case "Property":
              categoryId = 4;
              break;
            case 'Other':
              categoryId = 5;
              break;
          }


          var startDate = new Date(this.startDateTime);
          var endDate = new Date(this.endDateTime);
          this.startDateTime = startDate.getTime();
          this.endDateTime = endDate.getTime();

          alert(JSON.stringify({
            "categoryId": categoryId,
            "title": this.title,
            "description": this.description,
            "startDateTime": this.startDateTime,
            "endDateTime": this.endDateTime,
            "reservePrice": this.reservePrice,
            "startingBid": this.startingBid
          }));

          if(endDate < startDate){
            alert("Invalid auction run time");
          } else {
            alert("sending post");
            this.$http.post('http://localhost:4941/api/v1/auctions/', JSON.stringify({
              "categoryId": categoryId,
              "title": this.title,
              "description": this.description,
              "startDateTime": this.startDateTime,
              "endDateTime": this.endDateTime,
              "reservePrice": this.reservePrice,
              "startingBid": this.startingBid
            }), {headers: {'X-Authorization': this.$cookies.get("user_session")}})
              .then(function(response){
                alert("sent");
                alert(response.status);
              }, function(error){
                this.error = error;
                this.errorFlag = true;
              })

          }


        }
      }
    }
</script>

<style scoped>

</style>
