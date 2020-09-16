type Nullable<T> = T | null;

type XTarget = Array<Spawn>

/**
 * Stops the current running macro.
 */
export function stop(): void;

/**
 *
 * @param ms Number of milliseconds to wait (1000 = 1 second)
 *
 * ASYNC FUNCTION - Don't forget to put "await" in front of this
 */
export async function sleep(ms: number): void;

/**
 *
 * @param fn Function to run and repeat as a main loop
 * @param loopSpeed Delay in milliseconds after each run (defaults to 50ms)
 */
export async function main(fn: Function, loopSpeed: number): void;

/**
 *
 * @param port Port to listen for debugger. Default is 9229
 */
export function useDebugger(port: number): void;

/**
 *
 * @param spawnNames Array of exact names to match
 */
export function getClosestOfSpawnNames(spawnNames: Array<string>): Spawn;

/**
 *
 * @param spawn1 Origin
 * @param spawn2 Spawn 2
 * Gets the distance in units between two spawns
 */
export function distanceBetweenSpawns(spawn1: Spawn, spawn2: Spawn): number;

/** Export constants */
export const mq: MQGlobal;

/** Object Interfaces **/
export interface MQGlobal {
	/**
	 * Logs to MQ Chat window
	 */
	log(): void;

	/**
	 * Warns to chat window - Yellow text
	 */
	warn(): void;

	/**
	 *
	 * @param evalString String to parse by MacroQuest variable parsing
	 * @returns Return of the parsed string, possibly cast to number, bool or string
	 * @example eval('${Me.Name}') -> "Jamesjoyce"
	 * @example eval('${Me.Stunned}') -> false
	 * @example eval('${Me.Copper}') -> 12345
	 */
	eval(evalString): string | boolean | number;

	/**
	 *
	 * @param command Command to run
	 * @example run('say Hello there!') -> `/say Hello there!`
	 * @example run('bct Groupie //sit') -> `/bct Groupie //sit`
	 */
	run(command: string): void;

	/**
	 * @returns Spawn matching the ID or if not found, null
	 * @param id Spawn ID
	 */
	getSpawnById(id: string): Spawn;

	/**
	 * @returns An array of spawns
	 * @summary Gets all the spawns in the zone. Warning: This runs on the main thread and is not good performance. Try not to use this often.
	 */
	getZoneSpawns(): Array<Spawn>;

	/**
	 * @returns Spawn matching the ID or if not found, null
	 * @param exactName Exact spawn name to match (NPC)
	 * @param n default 1. N number away (3 will get third closest away, 1 will get closest)
	 */
	getNthNearestSpawn(exactName: string, n: number = 1): Spawn;

	/**
	 * Global character information
	 */
	me: CharacterInfo;
}

interface CharacterInfo {
	name: string;
	str: number;
	sta: number;
	cha: number;
	dex: number;
	int: number;
	agi: number;
	wis: number;
	guildId: number;
	aaExp: number;
	tributeTimer: number;
	benefitTimer: number;
	careerFavor: number;
	currFavor: number;
	groupLeadershipExp: number;
	raidLeadershipExp: number;
	groupLeadershipPoints: number;
	raidLeadershipPoints: number;
	radiantCrystals: number;
	ebonCrystals: number;
	exp: number;
	currWeight: number;
	hpBonus: number;
	manaBonus: number;
	enduranceBonus: number;
	combatEffectsCap: number;
	shieldingCap: number;
	spellShieldCap: number;
	avoidanceCap: number;
	accuracyCap: number;
	stunResistCap: number;
	strikeThroughCap: number;
	skillMinDamageModBonus: number;
	dotShieldCap: number;
	damageShieldMitigationCap: number;
	combatEffectsBonus: number;
	spellShieldBonus: number;
	shieldingBonus: number;
	damageShieldBonus: number;
	dotShieldBonus: number;
	damageShieldMitigationBonus: number;
	avoidanceBonus: number;
	accuracyBonus: number;
	stunResistBonus: number;
	strikeThroughBonus: number;
	heroicStrBonus: number;
	heroicIntBonus: number;
	heroicWisBonus: number;
	heroicAgiBonus: number;
	heroicDexBonus: number;
	heroicStaBonus: number;
	heroicChaBonus: number;
	heroicSvMagic: number;
	heroicSvFire: number;
	heroicSvCold: number;
	heroicSvDisease: number;
	heroicSvPoison: number;
	heroicSvCorruption: number;
	healAmountBonus: number;
	spellDamageBonud: number;
	clairvoyanceBonus: number;
	attackBonus: number;
	hpRegenBonus: number;
	manaRegenBonus: number;
	enduranceRegenBonus: number;
	attackSpeed: number;
	inCombat: number;
	downTime: number;
	downTimeStamp: number;
	stunned: number;
	zoneId: number;
	instance: number;
	standState: number;
	bankSharedPlat: number;
	bankSharedGold: number;
	bankSharedSilver: number;
	bankSharedCopper: number;
	bankPlat: number;
	bankGold: number;
	bankSilver: number;
	bankCopper: number;
	savePoison: number;
	saveMagic: number;
	saveDisease: number;
	saveCorruption: number;
	saveFire: number;
	saveCold: number;

	// Interfaces
	xTarget: XTarget;
	spawn: Spawn;
	/**
	 * @summary This can be null - use null coalescing operators to access anything inside of it
	 * @example 'mq.me.target?.displayedName'
	 */
	target: Nullable<Spawn>;
	group: GroupInfo;
	buffs: Array<Buff>;
}

interface Spawn {
	prev: Spawn;
	next: Spawn;
	speedMultiplier: number;
	timeStamp: number;
	lastName: number;
	x: number;
	y: number;
	z: number;
	speedX: number;
	speedY: number;
	speedZ: number;
	speedRun: number;
	heading: number;
	speedHeading: number;
	cameraAngle: number;
	underwater: boolean;
	feetWet: boolean;
	/**
	 * This will be priest_of_discord00
	 */
	name: number;
	/**
	 * This will be "Priest of Discord"
	 */
	displayedName: string;
	type: number;
	bodyType: number;
	avatarHeight: number;
	avatarHeight2: number;
	spawnId: number;
	isABoat: boolean;
	mount: number;
	rider: number;
	enduranceCurrent: number;
	mercenary: number;
	zone: number;
	instance: number;
	light: number;
	guildStatus: number;
	lastTick: number;
	level: number;
	gM: boolean;
	fishingEta: number;
	sneak: boolean;
	petId: number;
	anon: boolean;
	respawnTimer: number;
	aARank: number;
	hpMax: number;
	hpCurrent: number;
	innateEta: number;
	getMeleeRangeVar1: number;
	trader: number;
	holding: number;
	hideMode: number;
	pvpFlag: number;
	guildId: number;
	runSpeed: number;
	manaMax: number;
	standState: number;
	masterId: number;
	afk: boolean;
	enduranceMax: number;
	linkdead: boolean;
	buyer: number;
	title: string;
	fishingEvent: number;
	suffix: number;
	lfg: boolean;
	castingData: number;
	manaCurrent: number;
	deity: number;
	whoFollowing: number;
	groupAssistNpc: number;
	raidAssistNpc: number;
	groupMarkNpc: number;
	raidMarkNpc: number;
	targetOfTarget: number;
	race: number;
	class: number;
	gender: number;
	actorDef: number;
	armorColor: number;
	equipment: number;
	getMeleeRangeVar2: number;
	animation: number;
	walkSpeed: number;
	hideCorpse: number;
	invitedToGroup: number;
	groupMemberTargeted: number;
	levitate: number;
}

interface GroupInfo {
	member: Array<GroupMember>;
	leader: Spawn;
}

interface GroupMember {
	name: string;
	ownerName: string;
	level: number;
	offline: boolean;
	mainTank: boolean;
	mainAssist: boolean;
	puller: boolean;
	markNpc: number;
	masterLooter: boolean;
	roles: number;
	spawn: Spawn;
}

interface Buff {
	spellId: number;
	spell: Spell;
	/**
	 * Number of ticks
	 */
	duration: number;
	/**
	 * Number of ticks
	 */
	initialDuration: number;
	hitCount: number;
	modifier: number;
	x: number;
	y: number;
	z: number;
	type: number;
	casterLevel: number;
}

interface Spell {
	range: number;
	aERange: number;
	pushBack: number;
	pushUp: number;
	castTime: number;
	recoveryTime: number;
	recastTime: number;
	durationType: number;
	durationCap: number;
	manaCost: number;
	reagentID: number;
	reagentCount: number;
	noExpendReagent: number;
	calcIndex: number;
	numEffects: number;
	bookIcon: number;
	gemIcon: number;
	descriptionIndex: number;
	resistAdj: number;
	deity: number;
	spellAnim: number;
	spellIcon: number;
	durationParticleEffect: number;
	id: number;
	hateMod: number;
	resistPerLevel: number;
	resistCap: number;
	enduranceCost: number;
	enduranceValue: number;
	hateGenerated: number;
	hitCountType: number;
	hitCount: number;
	coneStartAngle: number;
	coneEndAngle: number;
	pvpResistBase: number;
	pvpCalc: number;
	pvpResistCap: number;
	pvpDuration: number;
	spellGroup: number;
	spellSubGroup: number;
	spellRank: number;
	maxResist: number;
	minResist: number;
	spreadRadius: number;
	critChanceOverride: number;
	maxTargets: number;
	minRange: number;
	uninterruptable: number;
	notStackableDot: number;
	deletable: number;
	bypassRegenCheck: number;
	canCastInCombat: boolean;
	canCastOutOfCombat: boolean;
	castNotStanding: boolean;
	canMgb: boolean;
	noDispell: boolean;
	isSkill: boolean;
	stacksWithDiscs: boolean;
	spellType: number;
	resist: number;
	targetType: number;
	castDifficulty: number;
	skill: number;
	zoneType: number;
	environment: number;
	timeOfDay: number;
	castingAnim: number;
	cancelOnSit: number;
	name: string;
	target: string;
	noRemove: boolean;
	description: string;
}
