var ProduceProductions = {
    poll_interval: 15000,
    leaderboard_selector: "#leaderboard",
    produce_stats: {},
    init: function() {
        this.poller = new spredfast.Poller();
        this.getProduce("veggies");
        this.getProduce("fruits");
    },
    getProduce: function(type) {
        var self = this;
        this.poller.poll({type: type, limit: 5}, function(data){
            self.produce_stats[type] = data;
            self.refresh();
            setTimeout(function() {
                self.getProduce(type);
            }, self.poll_interval);

        });
    },
    refresh: function() {
        if (this.produce_stats.veggies && this.produce_stats.fruits) {
            var produce = [].concat(this.produce_stats.veggies, this.produce_stats.fruits);
            produce.sort(function (a, b) {
                return a.count < b.count;
            });
            var newtable = "";
            $.each(produce, function (i, p) {
                newtable += "<tr><td class='produce-name'>" + p.name + "</td><td class='mentions'><span>" + p.count + "</span> Mentions</td></tr>";
            });
            $(this.leaderboard_selector).html(newtable);
        }

    }
}

$(function() {
  ProduceProductions.init();
});