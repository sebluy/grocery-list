import dayjs from "dayjs";
import {last, mean, startCase, toLower} from "lodash";

export default class Item {

    active;
    history;

    constructor(name, history = []) {
        this.key = toLower(name)
        this.active = true;
        this.history = history;
        this.predictNext();
    }

    name() {
        return startCase(this.key)
    }

    storageKey() {
        return 'groceries-item-' + this.key;
    }

    toggle() {
        if (this.active) {
            this.active = false;
            this.pushHistory();
        } else {
            this.active = true;
        }
    }

    pushHistory() {
        if (this.lastPurchase() < 1) {
            return;
        }

        this.history.push(dayjs());
        if (this.history.length > 3) {
            this.history.shift();
        }

        this.predictNext();
    }

    lastPurchase() {
        if (this.history.length === 0) {
            return undefined;
        }
        return dayjs().diff(last(this.history), 'day');
    }

    predictNext() {
        if (this.history.length <= 1) {
            return;
        }

        const durations = [];
        for (let i = 1; i < this.history.length; i += 1) {
            const duration = this.history[i].diff(this.history[i - 1], 'day');
            durations.push(duration);
        }

        const avg = Math.round(mean(durations));
        const last = this.lastPurchase();
        this.next = Math.abs(last - avg);
    }

    static fromJson(json) {
        const item = Object.assign(new Item(undefined), JSON.parse(json));

        if (typeof item.name === 'string') {
            item.key = toLower(item.name)
            delete item.name
        }

        item.history = item.history.map((d) => dayjs(d));
        item.predictNext();
        return item;
    }

}