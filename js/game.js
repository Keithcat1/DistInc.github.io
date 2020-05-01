// Variables

var player = Object.assign({}, DEFAULT_START)

// Temp

var tmp = {}

function updateTemp() {
	// Elements
	tmp.el = {}
	for (i=0;i<TMP_DATA.ELS.length;i++) {
		let id = TMP_DATA.ELS[i]
		tmp.el[id] = new Element(id)
	}
	
	// Acceleration
	tmp.acc = new ExpantaNum(0.1)
	if (player.rank.gt(2)) tmp.acc = tmp.acc.times(ExpantaNum.pow(1.1, player.rank))
	if (player.rank.gt(3)) tmp.acc = tmp.acc.times(2)
	if (player.tier.gte(2) && player.rank.gte(3)) tmp.acc = tmp.acc.times(2)
	if (player.rank.gt(4)) tmp.acc = tmp.acc.times(ExpantaNum.pow(3, player.tier))
	if (player.rank.gt(5)) tmp.acc = tmp.acc.times(ExpantaNum.pow(1.975, player.rank))
	if (player.rank.gt(10)) tmp.acc = tmp.acc.times(2)
	if (player.tier.gte(4)) tmp.acc = tmp.acc.times(3)
	if (player.rank.gt(15)) tmp.acc = tmp.acc.times(4)
	if (player.tier.gte(5)) tmp.acc = tmp.acc.times(5)
	if (tmp.rockets) tmp.acc = tmp.acc.times(tmp.rockets.accPow)
	

	// Max Velocity
	tmp.maxVel = new ExpantaNum(1)
	if (player.rank.gt(1)) tmp.maxVel = tmp.maxVel.plus(1)
	if (player.rank.gt(2)) tmp.maxVel = tmp.maxVel.times(ExpantaNum.pow(1.1, player.rank))
	if (player.tier.gte(2) && player.rank.gte(3)) tmp.maxVel = tmp.maxVel.times(5)
	if (player.rank.gt(4)) tmp.maxVel = tmp.maxVel.times(ExpantaNum.pow(3, player.tier))
	if (player.rank.gt(5)) tmp.maxVel = tmp.maxVel.times(ExpantaNum.pow(1.975, player.rank))
	if (player.rank.gt(8)) tmp.maxVel = tmp.maxVel.times(ExpantaNum.pow(1.1, player.rank))
	if (tmp.rockets) tmp.maxVel = tmp.maxVel.times(tmp.rockets.mvPow)
	
	// Ranks
	tmp.ranks = {}
	tmp.ranks.fp = new ExpantaNum(1)
	if (player.tier.gte(1)) tmp.ranks.fp = tmp.ranks.fp.times(1.25)
	if (player.tier.gte(3)) tmp.ranks.fp = tmp.ranks.fp.times(ExpantaNum.pow(1.1, player.tier))
	tmp.ranks.req = new ExpantaNum(10).times(ExpantaNum.pow(2, player.rank.div(tmp.ranks.fp).max(1).sub(1).pow(2)))
	tmp.ranks.desc = player.rank.lt(Number.MAX_VALUE)?(RANK_DESCS[player.rank.toNumber()]?RANK_DESCS[player.rank.toNumber()]:DEFAULT_RANK_DESC):DEFAULT_RANK_DESC
	tmp.ranks.canRankUp = player.distance.gte(tmp.ranks.req)
	tmp.ranks.layer = new Layer("rank", tmp.ranks.canRankUp, "semi-forced")
	
	// Tiers
	tmp.tiers = {}
	tmp.tiers.fp = new ExpantaNum(1)
	tmp.tiers.req = new ExpantaNum(3).plus(player.tier.times(tmp.tiers.fp).pow(2))
	tmp.tiers.desc = player.tier.lt(Number.MAX_VALUE)?(TIER_DESCS[player.tier.toNumber()]?TIER_DESCS[player.tier.toNumber()]:DEFAULT_TIER_DESC):DEFAULT_TIER_DESC
	tmp.tiers.canTierUp = player.rank.gte(tmp.tiers.req)
	tmp.tiers.layer = new Layer("tier", tmp.tiers.canTierUp, "semi-forced")
	
	// Rockets
	
	tmp.rockets = {}
	tmp.rockets.canRocket = player.distance.gte(LAYER_REQS["rockets"][1])
	tmp.rockets.layer = new Layer("rockets", tmp.rockets.canRocket, "normal")
	tmp.rockets.eff = player.rockets.plus(1).log10()
	tmp.rockets.accPow = tmp.acc.plus(1).log10().pow(tmp.rockets.eff).max(player.rockets.plus(1))
	tmp.rockets.mvPow = tmp.maxVel.plus(1).log10().pow(tmp.rockets.eff).max(player.rockets.plus(1))
}

// Elements

function updateElements() {
	// Main
	tmp.el.distance.setTxt(formatDistance(player.distance))
	tmp.el.velocity.setTxt(formatDistance(player.velocity))
	tmp.el.maxVel.setTxt(formatDistance(tmp.maxVel))
	tmp.el.acceleration.setTxt(formatDistance(tmp.acc))
	
	// Ranks
	tmp.el.rank.setTxt(showNum(player.rank))
	tmp.el.rankUp.setClasses({btn: true, locked: !tmp.ranks.canRankUp})
	tmp.el.rankDesc.setTxt(tmp.ranks.desc)
	tmp.el.rankReq.setTxt(formatDistance(tmp.ranks.req))
	
	// Tiers
	tmp.el.tier.setTxt(showNum(player.tier))
	tmp.el.tierUp.setClasses({btn: true, locked: !tmp.tiers.canTierUp})
	tmp.el.tierDesc.setTxt(tmp.tiers.desc)
	tmp.el.tierReq.setTxt(showNum(tmp.tiers.req))
	
	// Rockets
	tmp.el.rocketReset.setClasses({btn: true, locked: !tmp.rockets.canRocket})
	tmp.el.rocketGain.setTxt(showNum(tmp.rockets.layer.gain))
	tmp.el.rocketsAmt.setTxt(showNum(player.rockets))
	tmp.el.rocketsEff.setTxt(showNum(tmp.rockets.eff))
}

// Game Loop

function gameLoop(diff) {
	updateTemp()
	updateElements()
	updateTabs()
	player.velocity = player.velocity.plus(tmp.acc.times(diff)).min(tmp.maxVel)
	player.distance = player.distance.plus(player.velocity.times(diff))
}

var interval = setInterval(function() {
	gameLoop(new ExpantaNum(1/33))
}, 33)