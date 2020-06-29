/*
 * 发布订阅模式
 */

// 事件处理器，主题处理属性
interface EventQueue {
    [propName: string]: any|number;
}


class PubSub {
    // 唯一实例
    private static INSTANCE: any;
    // 事件队列
    protected eventQueue: EventQueue;
    // 订阅token uid prefix
    private uid: number = -1;
    // 暴露单例
    static getInstance(): any {
        if(!PubSub.INSTANCE) {
            PubSub.INSTANCE = new PubSub();
        }

        return PubSub.INSTANCE;
    }

    constructor() {
        this.eventQueue = {};
    }

    // subscribe topic
    subscribe(topic: string, fn: (data: any) => {}): string {

        ++this.uid;
        const token: string =  `_PubSub-${topic}-${this.uid}`;
        // @ts-ignore
        if(!(topic in this.eventQueue)) {
            this.eventQueue[topic] = {};
        }
        this.eventQueue[topic][token] = fn;
        return token;
    }

    // publish topic and send some message
    publish (topic: string, data: any) {
        // @ts-ignore
        if(!(topic in this.eventQueue)) {
            console.warn('NO SUBSCRIBE IN THIS TOPIC!');
            return;
        }
        for (let key in this.eventQueue[topic]) {
            this.eventQueue[topic][key].call(this, data);
        }
    }

    // get one topic's subscribers
    getOneTopicSubscribers(topic: string): Promise<any> {
        return new Promise(((resolve, reject) => {
            if(!(topic in this.eventQueue)) {
                reject('NO TOPIC IN HERE')
                return;
            }
            resolve({ topic, size: Object.keys(this.eventQueue[topic]).length })
        }))
    }

    // 获取所有订阅者
    getAllSubscribers(): Promise<any> {
        return new Promise(resolve => {
            let topicNum:number = Object.keys(this.eventQueue).length
            let subscribersNum:number = 0;

            for(let key in this.eventQueue) {
                subscribersNum+= Object.keys(this.eventQueue[key]).length;
            }

            resolve({
                topicNum,
                subscribersNum
            })
        })
    }

    // unsubscribe
    unsubscribe (token: string) {
        for(let key in this.eventQueue) {
            // @ts-ignore
            if(!(token in this.eventQueue[key] )) {
                console.warn("NO SUBSCRIBE");
                return;
            }
            delete this.eventQueue[key][token];
        }
    }

    // clear all subscribers
    clearAllSubscribe (): void {
        this.eventQueue = {};
    }

}

// export default PubSub.getInstance();

const pub = PubSub.getInstance();

pub.publish("Hello", "999")

const to1 = pub.subscribe("TEST", (data: any) => {
    console.log("TEST, TOPIC", data);
})
pub.subscribe("TEST", (data: any) => {
    console.log("TEST, TOPIC", data);
})
pub.subscribe("TEST", (data: any) => {
    console.log("TEST, TOPIC", data);
})
pub.subscribe("TEST", (data: any) => {
    console.log("TEST, TOPIC", data);
})

pub.publish("TEST", "99999999")

// pub.unsubscribe("000");
// pub.unsubscribe(to1);

pub.getOneTopicSubscribers('000')
pub.getOneTopicSubscribers('TEST')
.then((res: any) => {
    console.log(res, "get one")
});

pub.getAllSubscribers().then((data: any) => {
    console.log(data, "所有订阅者")
})