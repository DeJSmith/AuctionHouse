<template>
  <div>
    <div v-on:load="getLoggedIn()"></div>
    <div v-if="errorFlag" style="color: red">
      {{ error }}
    </div>
    <h1 v-if="!auctionTitle" class="text-center">{{title}}</h1>

    <div v-if="$route.params.aucId">
      <div>{{gotAuctions = true}}</div>
      <div id="Auction">
        <router-link :to="{name: 'userAuctions' }">Back to My Auctions</router-link>
        <br /><br />

        <table class="col-md-12" style="text-align: center">
          <tr>
            <td><h2>{{getSingleAuction($route.params.aucId).title }}</h2></td>
          </tr>

          <br /><br />

          <tr>
            <td><img src="assets/logo.png"/></td>
          </tr>
          
          <!---------------------------------------- Auction Details ---------------------------------------->
          <tr style="background-color: aliceblue">
            <td>
              <div class="container">
                <h2>Auction Details</h2>
                <div class="panel-group">
                  <div class="panel panel-default">
                    <div class="panel-heading">Seller</div>
                    <div class="panel-body">{{this.auction.seller}}</div>
                    <div class="panel-heading">Auction Opened</div>
                    <div class="panel-body">{{this.auction.startDateTime}}</div>
                    <div class="panel-heading">Auction Ends</div>
                    <div class="panel-body">{{this.auction.endDateTime}}</div>
                    <div class="panel-heading">Item Description</div>
                    <div class="panel-body">{{this.auction.description}}</div>
                  </div>
                  <div class="panel panel-default">
                    <div class="panel-heading">ReservePrice</div>
                    <div class="panel-body">{{"$" + this.auction.reservePrice}}</div>
                    <div class="panel-heading">Current Bid</div>
                    <div class="panel-body">{{"$" + this.auction.currentBid}}</div>
                  </div>
                  <div class="panel panel-default" style="text-align: center">
                    <div class="panel-heading" style="text-align: center">Bid History</div>
                    <table v-for="bid in auction.bids" style="text-align: center">
                      <tr style="text-align: center">
                        <td><div class="panel-heading">{{"User: " + bid.buyerUsername}}</div></td>
                      </tr>
                      <tr>
                        <td><div class="panel-body">{{"Time: " + getDate(bid.datetime)}}</div></td>
                      </tr>
                      <tr>
                        <td><div class="panel-body">{{"Amount: $" + bid.amount}}</div></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>

      </div>
    </div>

    <div v-if="this.$route.path == '/userAuctions'" id="Auctions" style="padding-left: 420px; padding-top: 50px; padding-bottom: 50px;">
      <div v-if="!gotAuctions"><div>{{getAuctions()}}</div></div>
      <table>
        <tr v-for="auction in userAuctions">
          <td><label>{{auction.creationDateTime}}</label></td>
          <td><router-link :to="{ name: 'getAuction', params: { aucId: auction.creationDateTime}}"><h3>{{auction.title}}</h3></router-link></td>
          <!--<td><img class="image-responsive" v-bind:src="getAuctionPhoto(auction.id)" n/></td>-->
          <td><img src="assets/churr.jpg"/> </td>
          <td><router-link :to="{ name: 'editAuction', params: { aucId: auction.creationDateTime}}"><h4>Edit</h4></router-link></td>
        </tr>
      </table>
    </div>
  </div>

</template>

<script>
    export default {
        data: function(){
          return {
            gotAuctions: false,
            auctionTitle: false,
            error: "",
            sellerId: this.$cookies.get("user_id"),
            errorFlag: false,
            title: "My Auctions",
            userAuctions: [],
            auctions: [],
            auction: {
              id: "",
              categoryTitle: "",
              categoryId: "",
              title: "",
              seller: "",
              sellerId:"",
              description: "",
              reservePrice: "",
              startDateTime: "",
              endDateTime: "",
              currentBid: "",
              bids: []
            },
          }
        },
      mounted: function(){
          //this.getAuctions();
      },

      methods: {
        //Default get all auctions
        getAuctions: function () {
          this.$http.get('http://localhost:4941/api/v1/auctions')
            .then(function (response) {
              this.auctions = response.data;
              this.sortAuctions();
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        },

        sortAuctions: function () {
          var id = this.$cookies.get("user_id");
          for (var i = 0; i < this.auctions.length; i++) {
            var aucId = this.auctions[i].id;
            this.getSingleAuction(aucId);
            this.gotAuctions = true;
          }
        },

        getSingleAuction: function (id) {
          this.$http.get('http://localhost:4941/api/v1/auctions/' + id)
            .then(function (response) {
              var data = response.body;
              var userId = this.$cookies.get("user_id");
              var aucId = data.seller.id;
              this.auction.id = id;
              this.auction.seller = data.seller.username;
              this.auction.sellerId = data.seller.id;
              this.auction.title = data.title;
              this.auction.description = data.description;
              this.auction.reservePrice = data.reservePrice;
              var startDate = new Date(data.startDateTime);
              var endDate = new Date(data.endDateTime);
              this.auction.startDateTime = startDate;
              this.auction.endDateTime = endDate;
              this.auction.currentBid = data.currentBid;
              this.auction.bids = data.bids;

              if(userId == aucId){
                if(this.uniqueAuction(aucId)){
                  data.creationDateTime = id;
                  this.sortBids();
                  this.userAuctions.push(data);
                }
              }
  
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
          return this.auction;
        },


        uniqueAuction: function(id){
          var unique = true;
          for(var i = 0; i < this.userAuctions.length; i++){
            if(this.userAuctions[i].creationDateTime == id){
              unique = false;
            }
          }

          return unique;
        },

        sortBids: function () {
          var sorted = [];
          for (var i = this.auction.bids.length - 1; i > 1; i--) {
            sorted.push(this.auction.bids[i])
          }
          this.auction.bids = sorted;
        },

      }

    }
</script>

<style scoped>

</style>
