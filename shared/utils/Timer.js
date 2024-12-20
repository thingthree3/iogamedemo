
export default class Timer {

    #duration;
    #updateInterval = 0;
    #isContinuous;
    #isActive = false;
    callBack;

    /**
     * @param {number} duration 
     * @param {boolean} isContinuous 
     * @param {() => void} callBack 
     */
    constructor(duration = 0, isContinuous = false, callBack = null){
        this.setNewTimer(duration, isContinuous, callBack);
    }

    /**
     * @param {number} duration 
     * @param {boolean} isContinuous 
     * @param {() => void} callBack 
     */
    setNewTimer(duration, isContinuous = false, callBack = null){
        this.#duration = duration;
        this.callBack = callBack;
        this.#isContinuous = isContinuous;
        this.#updateInterval = 0;
        this.#isActive = true;
    }

    /**
     * @returns {void}
     */
    activate(){
        this.#isActive = true;
        this.#updateInterval = 0;
    }

    /**
     * @returns {void}
     */
    deActivate(){
        this.#isActive = this.#isContinuous;
        this.#updateInterval = 0;
    }

    /**
     * @returns {boolean}
     */
    isActive(){
        return this.#isActive;
    }

    /**
     * @returns {number}
     */
    getDuration(){ return this.#duration; }

    /**
     * @returns {number}
     */
    getupdateInterval(){ return this.#updateInterval; }

    /**
     * @param {boolean} isContinuous 
     * @returns {void}
     */
    setIsContinuous(isContinuous){ this.#isContinuous = isContinuous; }

    /**
     * @param {number} duration 
     * @returns {void}
     */
    setDuration(duration){ this.#duration = duration; }

    /**
     * @param {number} deltatime
     * @returns {void}
     */
    update(deltatime = 1){
        this.#updateInterval += deltatime;
        // console.log((this.#isActive || this.#isContinuous), this.#updateInterval, this.#duration, deltatime, "tool updates")
        if(this.#updateInterval >= this.#duration && (this.#isActive || this.#isContinuous)){
            this.deActivate();
            this.callBack?.();
        }
    }
}