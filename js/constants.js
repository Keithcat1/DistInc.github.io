// Default Values

const DEFAULT_START = {
	tab: "main",
	achievements: [],
	distance: new ExpantaNum(0),
	velocity: new ExpantaNum(0),
	rank: new ExpantaNum(1),
	tier: new ExpantaNum(0),
	rockets: new ExpantaNum(0),
	rf: new ExpantaNum(0),
	automation: {
		unl: false,
		scraps: new ExpantaNum(0),
		intelligence: new ExpantaNum(0),
		robots: {},
		open: "none",
	},
}

// Temp Data

const TMP_DATA = {
	ELS: ["distance", "velocity", "maxVel", "acceleration", "rank", "rankUp", "rankDesc", "rankReq", "tier", "tierUp", "tierDesc", "tierReq", "rocketReset", "rocketGain", "rocketsAmt", "rocketsEff", "nextFeature", "achDesc", "rf", "rfReset", "rfReq", "rfEff", "scraps", "intAmt", "rankbot", "tierbot", "robotTab", "robotName", "robotInterval", "robotMagnitude", "buyRobotInterval", "buyRobotMagnitude"],
}

// Formatting Data

const DISTANCES = {
	cm: 1/100,
	m: 1,
	km: 1e3,
	Mm: 1e6,
	Gm: 1e9,
	Tm: 1e12, 
	Pm: 1e15,
	ly: 9.461e15,
	ps: 3.086e16,
	kps: 3.086e19,
	Mps: 3.086e22,
	Gps: 3.086e25,
	uni: 4.4e26,
	"K uni": 4.4e29,
	"M uni": 4.4e32,
	"B uni": 4.4e35,
	"T uni": 4.4e38,
	"Qa uni": 4.4e41,
	"Qi uni": 4.4e44,
	"Sx uni": 4.4e47,
	"Sp uni": 4.4e50,
	"Oc uni": 4.4e53,
	"No uni": 4.4e56,
	"Dc uni": 4.4e59,
}

const TIMES = {
	ms: 1/1000,
	s: 1,
	m: 60,
	h: 3600,
	d: 86400,
	w: 604800,
	y: 31556736,
	mil: 31556736000,
	"K mil": 31556736000*1e3,
	"M mil": 31556736000*1e6,
	"B mil": 31556736000*1e9,
	"T mil": 31556736000*1e12,
	"Qa mil": 31556736000*1e15,
	"Qi mil": 31556736000*1e18,
	"Sx mil": 31556736000*1e21,
	"Sp mil": 31556736000*1e24,
	"Oc mil": 31556736000*1e27,
	"No mil": 31556736000*1e30,
	"Dc mil": 31556736000*1e33,
}

// Ranks

const RANK_DESCS = {
	1: "increase the maximum velocity by 1m/s.",
	2: "increase the acceleration and maximum velocity by 10% for each rank up.",
	3: "double your acceleration.",
	4: "triple your acceleration & maximum velocity for each tier up.",
	5: "increase the acceleration and maximum velocity by 97.5% for each rank up.",
	8: "increase your maximum velocity by 10% for each rank up.",
	10: "double your acceleration.",
	15: "quadruple your acceleration.",
	20: "double intelligence gain.",
	25: "multiply your acceleration by 10.",
	30: "triple intelligence gain.",
	40: "multiply intelligence gain by the number of primes less than or equal to your scrap amount (minimum 1, softcaps after 1,000,000,000 primes).",
	50: "multiply your acceleration by 15.",
	60: "double scrap gain.",
	75: "multiply your acceleration by 25.",
	100: "double rocket gain.",
}

const DEFAULT_RANK_DESC = "rank up."

// Tiers

const TIER_DESCS = {
	0: "make the rank requirement formula 25% slower.",
	1: "double your acceleration and quintuple your maximum velocity if you are at least Rank 3.",
	2: "make the rank requirement formula 10% slower for each tier up.",
	4: "triple your acceleration.",
	5: "quintuple your acceleration.",
	8: "multiply your acceleration by 10.",
	10: "multiply your acceleration by 15.",
	12: "triple intelligence gain.",
	15: "multiply your acceleration by 25.",
}

const DEFAULT_TIER_DESC = "tier up."

// Layers

const LAYER_RESETS = {
	rank: ["distance", "velocity"],
	tier: ["distance", "velocity", "rank"],
	rockets: ["distance", "velocity", "rank", "tier"],
	rf: ["rockets"],
}

const LAYER_REQS = {
	rank: ["distance", 10],
	tier: ["rank", 3],
	rockets: ["distance", 5e7],
	rf: ["rockets", 25],
}

const LAYER_FP = {
	rank: 1,
	tier: 1,
	rockets: 0.4,
	rf: 1,
}

// Tab Data

const TABBTN_SHOWN = {
	main: function() { return true },
	achievements: function() { return true },
	rockets: function() { return (tmp.rockets ? (tmp.rockets.canRocket||player.rockets.gt(0)||player.rf.gt(0)) : false) },
	auto: function() { return player.automation.unl },
}

// Achievements

const ACH_DATA = {
	rows: 3,
	cols: 6,
	descs: {
		11: "Go at least 100m.",
		12: "Do a rank reset.",
		13: "Do a tier reset.",
		14: "Do a rocket reset.",
		15: "Get at least 1 rocket fuel.",
		16: "Unlock automation.",
		
		21: "Go at least 500km.",
		22: "Reach Rank 8.",
		23: "Reach Tier 3.",
		24: "Reach 2 Rockets.",
		25: "Get at least 2 rocket fuel.",
		26: "Unlock Rankbot.",
		
		31: "Go at least 1Tm",
		32: "Reach Rank 12",
		33: "Reach Tier 4",
		34: "Reach 10 Rockets.",
		35: "Get at least 3 rocket fuel.",
		36: "Unlock Tierbot.",
	},
	rewards: {
		12: "Acceleration is 10% higher.",
		14: "Acceleration & Maximum Velocity are 50% higher.",
		15: "Rocket gain is increased by 5%.",
		
		21: "Maximum Velocity is 10% higher.",
		23: "Acceleration is 20% higher.",
		24: "Maximum Velocity is 25% higher.",
		26: "Rocket gain is increased by 10%.",
		
		32: "Acceleration is 80% higher.",
		34: "Rocket gain is increased by 10%.",
		35: "Acceleration is 80% higher.",
	},
}

// Update Temp Data for Achievements

for (let r=1;r<=ACH_DATA.rows;r++) {
	for (let c=1;c<=ACH_DATA.cols;c++) {
		let id = r*10+c
		TMP_DATA.ELS.push("ach"+id)
	}
}

// Automation

const AUTO_UNL = new ExpantaNum(1e12)
const ROBOT_REQS = {
	rankbot: new ExpantaNum(10),
	tierbot: new ExpantaNum(50),
}
const ROBOT_COST_INC = {
	interval: {
		rankbot: new ExpantaNum(7),
		tierbot: new ExpantaNum(8),
	},
	magnitude: {
		rankbot: new ExpantaNum(3),
		tierbot: new ExpantaNum(4),
	},
}
const ROBOT_COST_START = {
	interval: {
		rankbot: new ExpantaNum(2),
		tierbot: new ExpantaNum(2),
	},
	magnitude: {
		rankbot: new ExpantaNum(1),
		tierbot: new ExpantaNum(1),
	},
}
const ROBOT_START_INTERVAL = {
	rankbot: new ExpantaNum(4),
	tierbot: new ExpantaNum(5),
}
const ROBOT_FL = {
	rankbot: "ranks",
	tierbot: "tiers",
}