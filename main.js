let cp = {};

cp.myPosition = {
    'lat': 0,
    'long': 0,
    'combined': 0
};

cp.success = function (position) {
    cp.myPosition.lat = position.coords.latitude;
    cp.myPosition.long = position.coords.longitude;
    cp.myPosition.combined = position.coords.latitude + position.coords.longitude;
    console.log(cp.myPosition);
    cp.getDistances();
}

cp.error = function () {
    console.log('Location could not be determined - an error occured trying to return position.');
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(cp.success, cp.error);
} else {
    alert('Location could not be determined - geolocation is not supported by this device.');
}

cp.getDistances = function () {

    $.getJSON("coupons.json", (data) => {

        let coupons = data.coupons;
        let sorted = [];
        let unsorted = [];
        let final = [];
        let sortCount = 0;

        for (let coupon = 0; coupon < coupons.length; coupon++) {

            sorted.push(coupons[coupon]);
            unsorted.push(coupons[coupon]);

            let couponCombinedCoords = cp.myPosition.combined - (coupons[coupon].coords.lat + coupons[coupon].coords.long);
            if (couponCombinedCoords > 0) {
                sorted[coupon].proximity = couponCombinedCoords;
            } else {
                sorted[coupon].proximity = couponCombinedCoords * -1;
            }
        }
        sorted.sort((a, b) => {
            return a.proximity - b.proximity;
        });

        while (sortCount < 5) {

            for (let coupon = 0; coupon < coupons.length; coupon++) {

                if (unsorted[coupon].id === sorted[sortCount].id) {
                    unsorted[coupon].nearby = true;
                }

            }
            sortCount++;

        }

        for (let coupon = 0; coupon < 5; coupon++) {
            final.push(sorted[coupon]);
        }

        for (let coupon = 0; coupon < coupons.length; coupon++) {
            if (!unsorted[coupon].nearby) {
                final.push(unsorted[coupon]);
            }
        }

        for (let coupon = 0; coupon < coupons.length; coupon++) {
            if (coupon === 5) {
                $('<li data-role="list-divider">Other Deals</li>').appendTo('.coupon-list');
            }
            $('<li><a href=#' + final[coupon].id + '>' + final[coupon].name + '</a></li>').appendTo('.coupon-list');
            $('<div data-role="page" id=' + final[coupon].id + '><div data-role="header" data-add-back-btn="true"><h1>' + final[coupon].name + '</h1></div><div data-role="content"><img class="coupon-thumb" src=' + final[coupon].thumb + '><div class="location">' + final[coupon].location + '</div><p class="description">' + final[coupon].description + '</p><p class="price">Pay just ₪ ' + final[coupon].price + ' insted of ₪ ' + final[coupon]["original-price"] + '!</p></div></div>').appendTo('body');
        }
        $(".coupon-list").listview("refresh");

    });

}