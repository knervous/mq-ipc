import { MQGlobal } from "./mq";

export function clientConnect(mq: MQGlobal) : MqIpcClient;

interface MqIpcClient {
    /**
     * You can wait for this to complete to ensure we are connected to the server
     */
    onConnected: Promise<void>,

    /**
     * Try to reconnect
     */
    tryReconnect() : void,

    /**
     * Disconnect from server
     */
    disconnect(): void,


    /**
     * @summary Evaluates a function in the targeted player's runtime
     * @param player Player name
     * @param fn Function to evaluate
     * @example const value = await playerEval('MySecondToon', () => { return mq.me.name }) // value === 'MySecondToon'
     * @example await playerEval('MySecondToon', () => mq.run('sit')) // Tells MySecondToon to sit
     */
    playerEval(player: string, fn: function): Promise<any>,

    /**
     * 
     * @param player Player name
     */
    playerGetHealth(player: string): Promise<number>,

    /**
     * 
     * @param player Player name
     */
    playerGetMana(player: string): Promise<number>,


    /**
     * @summary Evaluates a function in all current clients' runtime including your own
     * @param fn Function to evaluate
     * @example const values = await allEval(() => { return mq.me.name }) // values === { MyFirstToon: 'MyFirstToon', MySecondToon: 'MySecondToon' }
     */
    allEval(fn: function): Promise<object>,

    /**
     * @summary Gets all players' health
     * @example const allHealths = await allGetHealth(); // allHealths === { MyFirstToon: 133, MySecondToon: 200 } 
     */
    allGetHealth(): Promise<object>,

    /**
     * @summary Gets all players' mana
     * @example const allHealths = await allGetMana(); // allHealths === { MyFirstToon: 144, MySecondToon: 0 } 
     */
    allGetMana(): Promise<object>,
}